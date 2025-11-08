from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pessoa

class PessoaDTO(serializers.ModelSerializer):
    peso_ideal = serializers.SerializerMethodField()

    class Meta:
        model = Pessoa
        fields = ['id', 'nome', 'data_nasc', 'cpf', 'sexo', 'altura', 'peso', 'peso_ideal']
        read_only_fields = ['id', 'peso_ideal']

    def validate_cpf(self, value):
        if self.instance and self.instance.cpf == value:
            return value
        
        if Pessoa.objects.filter(cpf=value).exists():
            raise serializers.ValidationError("Este CPF já existe.")
        return value

    def validate_sexo(self, value):
        if value not in ['M', 'F']:
            raise serializers.ValidationError("Sexo deve ser 'M' ou 'F'.")
        return value

    def get_peso_ideal(self, obj):
        return obj.calcular_peso_ideal()