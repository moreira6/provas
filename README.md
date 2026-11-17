# Provas — projeto estático

Este projeto usa apenas HTML, CSS e JavaScript. Não precisa de banco de dados nem de servidor próprio.

## Como visualizar
Abra `index.html` no navegador. Para publicar, envie a pasta inteira para um repositório GitHub e conecte o repositório à Vercel.

## Como adicionar resumos públicos
1. Coloque o PDF na pasta da matéria correspondente dentro de `materiais/`.
2. Abra `data.js`.
3. Dentro da matéria correta, acrescente um objeto na lista `materials`, por exemplo:

```js
materials: [
  {
    title: "Introdução à Psicologia Hospitalar",
    file: "materiais/psicologia-hospitalar/introducao.pdf",
    type: "PDF"
  }
]
```

4. Salve e publique novamente na Vercel. O arquivo e o link ficarão disponíveis para todos os visitantes.

Pastas:
- `materiais/psicologia-hospitalar/`
- `materiais/psicologia-comunitaria/`
- `materiais/processos-grupais/`

## Como funcionam as atividades
A interface permite criar questões de múltipla escolha. Por ser um site estático sem backend, as questões criadas pelo formulário ficam salvas somente no navegador em que foram criadas. Para disponibilizar uma questão para todos os visitantes, ela precisa ser adicionada ao projeto/código e publicada novamente.

## Importante
Tudo que for incluído no projeto publicado será público. Não coloque dados pessoais, documentos privados ou materiais que você não tenha autorização para compartilhar.
