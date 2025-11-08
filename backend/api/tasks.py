from .models import Pessoa
from django.http import Http404, JsonResponse
from django.core.serializers import serialize
import json

class PessoaTask:

    def list_pessoas(self):
        pessoas = Pessoa.objects.all()
        data = serialize("json", pessoas)

        return data
    
    def get_pessoa_by_id(self, pk):
        try:
            return Pessoa.objects.get(pk=pk)
        except Pessoa.DoesNotExist:
            raise Http404

    def create_pessoa(self, validated_data):
        return Pessoa.objects.create(**validated_data)

    def update_pessoa(self, instance, validated_data):
        instance.nome = validated_data.get('nome', instance.nome)
        instance.data_nasc = validated_data.get('data_nasc', instance.data_nasc)
        instance.cpf = validated_data.get('cpf', instance.cpf)
        instance.sexo = validated_data.get('sexo', instance.sexo)
        instance.altura = validated_data.get('altura', instance.altura)
        instance.peso = validated_data.get('peso', instance.peso)
        instance.save()
        return instance

    def delete_pessoa(self, instance):
        instance.delete()