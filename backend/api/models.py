from django.db import models

class Pessoa(models.Model):
    SEXO = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    ]

    nome = models.CharField(max_length=255, verbose_name="Nome Completo")
    data_nasc = models.DateField(null=False, unique=False, verbose_name="Data de Nascimento")
    cpf = models.CharField(max_length=11, unique=True, verbose_name="CPF")
    sexo = models.CharField(max_length=1, choices=SEXO, verbose_name="Sexo")
    altura = models.FloatField(verbose_name="Altura")
    peso = models.FloatField(verbose_name="Peso")

    def __str__(self):
        return self.nome

    def calcular_peso_ideal(self):
        if not self.altura or self.altura <= 0:
            return None

        try:            
            if self.sexo == 'M':
                fator_1 = 72.7
                fator_2 = 58
            elif self.sexo == 'F':
                fator_1 = 62.1
                fator_2 = 44.7
            else:
                return None

            peso_ideal = (fator_1 * self.altura) - fator_2

            return round(peso_ideal, 2)
        
        except Exception:
            return None