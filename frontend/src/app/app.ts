import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  private pessoaService = inject(PessoaService);

  idPesquisaControl = new FormControl<number | null>(null);
  
  pessoaForm!: FormGroup;
  
  pessoaEncontrada = signal<Pessoa | null>(null);
  
  mensagem = signal('');
  tipoMensagem = signal<'success' | 'error'>('success');

  pesoIdealPopup = signal<number | null>(null);

  ngOnInit(): void {
    this.pessoaForm = new FormGroup({
      id: new FormControl({ value: null, disabled: true }),
      data_nasc: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
      sexo: new FormControl<null | 'M' | 'F'>(null, [Validators.required]),
      altura: new FormControl<number | null>(null, [Validators.required, Validators.min(0.5)]),
      peso: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    });
    
    this.pessoaForm.get('cpf')!.valueChanges.subscribe(value => {
      this.formatarCPF(value);
    });

  }

  private formatarCPF(value: string | null) {
    if (!value) {
      return;
    }

    let cpfLimpo = value.replace(/\D/g, '');

    if (cpfLimpo.length > 11) {
      cpfLimpo = cpfLimpo.substring(0, 11);
    }

    let cpfFormatado = cpfLimpo;

    if (cpfLimpo.length > 9) {
      cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (cpfLimpo.length > 6) {
      cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cpfLimpo.length > 3) {
      cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    if (cpfFormatado !== value) {
      this.pessoaForm.get('cpf')!.patchValue(cpfFormatado, { emitEvent: false });
    }
  }
  
  onPesquisar(): void {
    const id = this.idPesquisaControl.value;
    if (!id || id <= 0) {
      this.mostrarMensagem('Por favor, insira um ID válido.', 'error');
      return;
    }

    this.limparMensagem();
    this.pessoaService.getPessoa(id).subscribe({
      next: (pessoa) => {
        this.pessoaEncontrada.set(pessoa);
        this.pessoaForm.patchValue(pessoa);
        this.mostrarMensagem('Pessoa encontrada com sucesso!', 'success');
      },
      error: (err) => {
        if (err.status === 404) {
          this.mostrarMensagem('Pessoa não encontrada (ID: ' + id + ').', 'error');
        } else {
          this.mostrarMensagem('Erro ao pesquisar: ' + this.formatarErro(err), 'error');
        }
        this.limparFormulario();
      }
    });
  }

  onIncluir(): void {
    if (this.pessoaForm.invalid || this.pessoaEncontrada()) {
      return;
    }
    
    const dadosFormulario = this.pessoaForm.getRawValue();
    
    const novaPessoa: Omit<Pessoa, 'id' | 'peso_ideal'> = {
      nome: dadosFormulario.nome,
      data_nasc: dadosFormulario.data_nasc,
      cpf: dadosFormulario.cpf.replace(/\D/g, ''),
      sexo: dadosFormulario.sexo,
      altura: dadosFormulario.altura,
      peso: dadosFormulario.peso,
    };

    this.limparMensagem();
    this.pessoaService.createPessoa(novaPessoa).subscribe({
      next: (pessoaCriada) => {
        this.mostrarMensagem(`Pessoa '${pessoaCriada.nome}' cadastrada com sucesso! (ID: ${pessoaCriada.id}).`, 'success');
        this.limparFormulario();
      },
      error: (err) => {
        this.mostrarMensagem('Erro ao cadastrar: ' + this.formatarErro(err), 'error');
      }
    });
  }

  onAlterar(): void {
    const pessoaAtual = this.pessoaEncontrada();

    if (this.pessoaForm.invalid || !pessoaAtual) {
      return;
    }

    const id = pessoaAtual.id;
    const dadosFormulario = this.pessoaForm.getRawValue();

    if (dadosFormulario.cpf) {
      dadosFormulario.cpf = dadosFormulario.cpf.replace(/\D/g, '');
    }
    

    this.limparMensagem();
    this.pessoaService.updatePessoa(id, dadosFormulario).subscribe({
      next: (pessoaAtualizada) => {
        this.mostrarMensagem(`Pessoa (ID: ${id}) alterada com sucesso.`, 'success');
        this.pessoaEncontrada.set(pessoaAtualizada);
        this.pessoaForm.patchValue(pessoaAtualizada);
      },
      error: (err) => {
        this.mostrarMensagem('Erro ao alterar: ' + this.formatarErro(err), 'error');
      }
    });
  }

  onExcluir(): void {
    const pessoaAtual = this.pessoaEncontrada();
    if (!pessoaAtual) {
      return;
    }

    const id = pessoaAtual.id;
    const nome = pessoaAtual.nome;

    if (!window.confirm(`Tem certeza que deseja excluir '${nome}' (ID: ${id})?`)) {
      return;
    }

    this.limparMensagem();
    this.pessoaService.deletePessoa(id).subscribe({
      next: () => {
        this.mostrarMensagem(`Pessoa '${nome}' (ID: ${id}) excluída com sucesso.`, 'success');
        this.limparFormulario();
      },
      error: (err) => {
        this.mostrarMensagem('Erro ao excluir: ' + this.formatarErro(err), 'error');
      }
    });
  }

  limparFormulario(): void {
    this.pessoaForm.reset({
      id: { value: null, disabled: true },
      sexo: null
    });
    this.idPesquisaControl.reset();
    this.pessoaEncontrada.set(null);
  }

  fecharPopup(): void {
    this.pesoIdealPopup.set(null);
  }

  onCalcularPesoIdeal(): void {
    const pessoa = this.pessoaEncontrada();
    // O 'peso_ideal' veio do servidor quando pesquisamos (agora com a fórmula correta)
    if (pessoa && pessoa.peso_ideal) {
      this.pesoIdealPopup.set(pessoa.peso_ideal);
    } else if (pessoa) {
      // Se não veio (ex: altura ou sexo nulos no banco)
      this.mostrarMensagem('Não foi possível calcular o peso ideal. Verifique se a altura e o sexo estão corretos.', 'error');
    }
  }


  private mostrarMensagem(msg: string, tipo: 'success' | 'error'): void {
    this.mensagem.set(msg);
    this.tipoMensagem.set(tipo);
  }

  private limparMensagem(): void {
    this.mensagem.set('');
  }

  private formatarErro(err: HttpErrorResponse): string {
    console.error(err);
    if (err.error) {
      if (typeof err.error === 'object' && !Array.isArray(err.error)) {
        const campo = Object.keys(err.error)[0];
        if(campo && Array.isArray(err.error[campo])) {
          return `${campo}: ${err.error[campo][0]}`;
        }
      }
      if (typeof err.error === 'string') return err.error;
      return JSON.stringify(err.error);
    }
    return err.message;
  }
}