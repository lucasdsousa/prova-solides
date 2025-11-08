from rest_framework import viewsets, status
from rest_framework.response import Response
from .services import PessoaService

class PessoaViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = PessoaService()

    def list(self, request):
        return self.service.list_pessoas()

    def create(self, request):
        return self.service.create_pessoa(request.data)

    def retrieve(self, request, pk=None):
        return self.service.find_pessoa(pk)

    def update(self, request, pk=None):
        return self.service.update_pessoa(pk, request.data)

    def destroy(self, request, pk=None):
        return self.service.delete_pessoa(pk)