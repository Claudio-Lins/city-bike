# Instruções para Configuração do Projeto City Bike

Este documento fornece as instruções necessárias para instalar as dependências, rodar o servidor de desenvolvimento e configurar a variável de ambiente necessária para o projeto.

## Pré-requisitos

Certifique-se de ter o Node.js instalado na sua máquina. Você pode baixar a versão mais recente [aqui](https://nodejs.org/).

## 1. Instalação das Dependências

Após clonar o repositório, navegue até a raiz do projeto e execute o seguinte comando para instalar as dependências:

```
npm install
```

Este comando irá instalar todas as dependências listadas no arquivo package.json, incluindo React, Next.js, Leaflet, Tailwind CSS, entre outros.

## 2. Rodando o Servidor de Desenvolvimento

```
npm run dev
```

Isso irá iniciar o servidor Next.js em modo de desenvolvimento. Por padrão, o servidor estará disponível em http://localhost:3000.

## 3. Configuração da Variável de Ambiente

Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_API_URL=http://api.citybik.es/v2
```

# Nota Importante para Produção

Portanto, para produção, o arquivo .env deve ser configurado da seguinte forma:

```
NEXT_PUBLIC_API_URL=https://api.citybik.es/v2
```

## 4. Construção e Deploy

Para criar a versão otimizada para produção, use o comando:

```
npm run build
```

Após a conclusão da build, você pode iniciar a aplicação otimizada com:

```
npm start
```

Esse comando iniciará o servidor Next.js no modo de produção.

## 5. Linting

Para verificar a qualidade do código e garantir que ele segue os padrões configurados, execute:

```
npm run lint
```

## 6. Observações Finais

    •	Certifique-se de que todas as variáveis de ambiente necessárias estejam corretamente configuradas antes de iniciar o servidor em produção.
    •	Verifique se o endpoint da API está usando https em produção, especialmente se o deploy for feito na Vercel.

Siga essas instruções para garantir que o projeto funcione corretamente tanto em desenvolvimento quanto em produção.

Este texto agora está formatado corretamente em Markdown e pode ser utilizado diretamente em um arquivo README ou documentação similar. Se precisar de mais algum ajuste, estou aqui para ajudar!
