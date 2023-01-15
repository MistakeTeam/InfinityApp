# Spotify API

Esse é um wrapper para [Spotify Web API](https://developer.spotify.com/web-api/) através do fluxo do Código de Autorização (Autenticação somente de aplicativo) que é executado no Node.JS.

## Características

Atualmente são poucas as funcionalidades disponíveis no wrapper, veja os planos futuros para saber mais.

* Metadados de música trazem álbuns, artistas, faixas, recursos de áudio e análise de faixas, álbuns para um artista específico, principais faixas de um artista específico e artistas semelhantes a um artista específico
* Perfis com tipo de produto, nome para exibição, data de nascimento, imagem
* Pesquise álbuns, artistas, faixas e playlists
* Obtenha dispositivos disponíveis de um usuário, informações sobre a reprodução atual do usuário, faixas reproduzidas recentemente pelo usuário atual
* Obtenha novos lançamentos, listas de reprodução em destaque, lista de categorias, categoria, listas de reprodução de uma categoria, recomendações baseadas em sementes, sementes de gênero disponíveis

## Planos futuros

* `refreshCallback` ainda é muito lento para atualizar o token, pretendo melhorar essa detecção no futuro.
* Adicionar mais `Endpoints` para uma maior interação com a API do spotify.
* Adicionar suporte a concessão de código de autorização (assinado pelo usuário).

## Modo de usar

Antes de tudo, instancie o wrapper.

```javascript
var SpotifyApi = require('spotify-api');

// Todas as opções são obrigatórias
var s = new SpotifyApi({
    token: "-------------TOKEN-------------",
    refreshtoken: "-------------REFRESHTOKEN-------------",
    refreshCallback: "https://localhost:3000/refresh_token"
});
```

Aviso: `refreshCallback` serve para atualizar o token automaticamente quando se retorna o `erro 401`, então lembre-se de executar um ponto pra `refreshtoken` usando um web framework, recomendo usar [express](https://github.com/expressjs/express)