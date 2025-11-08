export interface Pessoa {
    id: number;
    nome: string;
    data_nasc: Date;
    cpf: string;
    sexo: 'M' | 'F';
    altura: number;
    peso: number;
    peso_ideal?: number;
}