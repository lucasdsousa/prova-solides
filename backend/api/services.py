from .tasks import PessoaTask
from .serializers import PessoaDTO
from rest_framework import status
from rest_framework.response import Response

class PessoaService:

    def __init__(self):
        self.task = PessoaTask()

    def list_pessoas(self):
        return Response(self.task.list_pessoas())

    def create_pessoa(self, data):
        serializer = PessoaDTO(data=data)
        if serializer.is_valid():
            pessoa = self.task.create_pessoa(serializer.validated_data)
            return Response(PessoaDTO(pessoa).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def find_pessoa(self, pk):
        pessoa = self.task.get_pessoa_by_id(pk)
        serializer = PessoaDTO(pessoa)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_pessoa(self, pk, data):
        pessoa = self.task.get_pessoa_by_id(pk)
        
        serializer = PessoaDTO(instance=pessoa, data=data, partial=True)
        
        if serializer.is_valid():
            pessoa_updated = self.task.update_pessoa(pessoa, serializer.validated_data)
            return Response(PessoaDTO(pessoa_updated).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete_pessoa(self, pk):
        pessoa = self.task.get_pessoa_by_id(pk)
        
        self.task.delete_pessoa(pessoa)
        
        return Response(status=status.HTTP_204_NO_CONTENT)