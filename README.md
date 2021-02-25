## Requisitos
* [Node.js](https://nodejs.org/en/download/ "Node.js")


## Informações
Persistência de dados usando SQLite, interface é um website usando Express.
O programa não vem com nenhum usuário, sala ou espaço por padrão mas é possível adicionar manualmente através da interface e também gerar automaticamente com o comando `npm run reset`, mais detalhes abaixo.

## Preparo e uso
1. Instale o [Node.js](https://nodejs.org/en/download/ "Node.js")
2. Clone ou baixe o repositório para sua maquina
3. Entre na pasta do projeto com sua linha de comando (Tecla do windows + R)
	Exemplo:
	```bash
	cmd.exe /k "cd C:\Usuários\Administrador\Área de trabalho\orange-purple-green-grapes"
	```
4. Uma vez com a linha de comando aberta e na pasta principal do projeto, digite o comando
`npm install`
5. Aguarde o final da instalação
6. Inicie usando o comando
`node app.js`
	Ou gere novos membros, salas e espaços automáticamente com o comando
	`npm run reset`
7. Visite o endereço que aparece no programa usando seu navegador de preferência
	(Endereço padrão http://127.0.0.1:8080/)

Feche o programa a qualquer momento pressionando CTRL + C com a janela do programa ativa.


## Testes unitários
Testes simples podem ser feitos com o comando `npm run tests`

## Mudando o IP ou porta
1. Crie um arquivo chamado `.env` na pasta principal do projeto
2. Preencha de acordo
    ```bash
	IP="127.0.0.1"
    PORT="8080"
    ```
3. Salve

## Demonstração
Uma versão hospedada online está disponível [aqui](https://orange-purple-grapes.glitch.me/ "Demo").
Por ser livre para usar por qualquer um, o uso local e privado após clonar este repositório é recomendado.