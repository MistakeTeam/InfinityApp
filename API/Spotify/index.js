"use strict";

const Endpoints = require("./Rest/Endpoints");
const RequestHandler = require("./Rest/RequestHandler");
const Album = require('./Estruturas/Album');
const Artist = require('./Estruturas/Artist');
const Categories = require('./Estruturas/Categories');
const CurrentlyPlayer = require('./Estruturas/CurrentlyPlayer');
const User = require('./Estruturas/User');
const Playlist = require('./Estruturas/Playlist');
const RecentlyPlayed = require('./Estruturas/RecentlyPlayed');
const Track = require('./Estruturas/Track');

let EventEmitter;
try {
    EventEmitter = require("eventemitter3");
} catch (err) {
    EventEmitter = require("events").EventEmitter;
}

class SpotifyAPI extends EventEmitter {
    /**
     * Create a Client
     * @arg {Object} [options] Spotify options
     * @arg {String} [options.token] api token
     * @arg {String} [options.refreshtoken] api refresh token
     * @arg {String} [options.refreshCallback] URL para RefreshToken para caso o token expire, a api irá tentar requisitar um novo token
     */
    constructor(options) {
        super();

        this.options = {
            token: "",
            refreshtoken: "",
            refreshCallback: ""
        }

        if (typeof options === "object") {
            for (var property of Object.keys(options)) {
                this.options[property] = options[property];
            }
        }

        if (this.options.refreshCallback == "") {
            throw new Error("URL para RefreshToken não pode ficar vazio");
        }

        this.requestHandler = new RequestHandler(this);

        this.ready = false;
    }

    /**
     * Atualize o token
     * @returns {void}
     */
    setAccessToken(newToken) {
        this.options.token = newToken;
    }

    /**
     * Atualize o refreshtoken
     * @returns {void}
     */
    setRefreshToken(newRefreshtoken) {
        this.options.refreshtoken = newRefreshtoken;
    }

    /**
     * Retorna um album
     * @returns {Promise<Album>}
     */
    getAlbum(albumID) {
        return this.requestHandler.request("GET", Endpoints.ALBUM(albumID));
    }

    /**
     * Retorna as tracks do album
     * @returns {Promise<[Track]>}
     */
    getAlbumTrack(albumID) {
        return this.requestHandler.request("GET", Endpoints.ALBUM_TRACK(albumID));
    }

    /**
     * Retorna vários albuns
     * @returns {Promise<[Album]>}
     */
    getAlbums() {
        return this.requestHandler.request("GET", Endpoints.ALBUMS);
    }

    /**
     * Retorna um artista
     * @returns {Promise<Artist>}
     */
    getArtist(artistID) {
        return this.requestHandler.request("GET", Endpoints.ARTIST(artistID));
    }

    /**
     * Retorna os albuns do artista
     * @returns {Promise<Album>}
     */
    getArtistAlbums(artistID) {
        return this.requestHandler.request("GET", Endpoints.ARTIST_ALBUM(artistID));
    }

    /**
     * Retorna os artistas relacionados ao artista
     * @returns {Promise<[Track]>}
     */
    getArtistRelatedArtists(artistID) {
        return this.requestHandler.request("GET", Endpoints.ARTIST_RELATED_ARTISTS(artistID));
    }

    /**
     * Retorna um artista
     * @returns {Promise<[Artist]>}
     */
    getArtistTopTracks(artistID) {
        return this.requestHandler.request("GET", Endpoints.ARTIST_TOP_TRACKS(artistID));
    }

    /**
     * Retorna vários artistas
     * @returns {Promise<[Artist]>}
     */
    getArtists() {
        return this.requestHandler.request("GET", Endpoints.ARTISTS);
    }

    getAudioAnalysi(trackID) {
        return this.requestHandler.request("GET", Endpoints.AUDIO_ANALYSI(trackID));
    }

    getAudioFeature(trackID) {
        return this.requestHandler.request("GET", Endpoints.AUDIO_FEATURE(trackID));
    }

    getAudioFeatures() {
        return this.requestHandler.request("GET", Endpoints.AUDIO_FEATURES);
    }

    /**
     * Retorna uma categoria
     * @returns {Promise<Categories>}
     */
    getBrowseCategorie(categoryID) {
        return this.requestHandler.request("GET", Endpoints.BROWSE_CATEGORIE(categoryID));
    }

    /**
     * Retorna a listas de reprodução de uma categoria
     * @returns {Promise<[Playlist]>}
     */
    getBrowseCategoriePlaylists(categoryID) {
        return this.requestHandler.request("GET", Endpoints.BROWSE_CATEGORIE_PLAYLISTS(categoryID));
    }

    /**
     * Retorna uma lista de categorias
     * @returns {Promise<[Categories]>}
     */
    getBrowseCategories() {
        return this.requestHandler.request("GET", Endpoints.BROWSE_CATEGORIES);
    }

    /**
     * Retorna uma lista de listas de reprodução em destaque
     * @returns {Promise<[Playlist]>}
     */
    getBrowseFeaturedPlalist() {
        return this.requestHandler.request("GET", Endpoints.BROWSE_FEATURED_PLAYLISTS);
    }

    /**
     * Retorna uma lista de novos lançamentos
     * @returns {Promise<[Album]>}
     */
    getBrowseNewReleases() {
        return this.requestHandler.request("GET", Endpoints.BROWSE_NEW_RELEASES);
    }

    /**
     * Retorna o perfil do usuário atual
     * @returns {Promise<User>} 
     */
    getMe() {
        return this.requestHandler.request("GET", Endpoints.ME);
    }

    getMeAlbums() {
        return this.requestHandler.request("GET", Endpoints.ME_ALBUMS);
    }

    getMeAlbumsContains() {
        return this.requestHandler.request("GET", Endpoints.ME_ALBUMS_CONTAINS);
    }

    getMePlayer() {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYER);
    }

    /**
     * Retorna a faixa atualmente em reprodução do usuário
     * @returns {Promise<CurrentlyPlayer>} 
     */
    getCurrentlyPlaying() {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYER_CURRENTLY_PLAYING);
    }

    getMePlayerDevices() {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYER_DEVICES);
    }

    /**
     * Retorna as trilhas reproduzidas recentemente pelo usuário atual
     * @returns {Promise<RecentlyPlayed>} 
     */
    getRecentlyPlayed() {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYER_RECENTLY_PLAYED);
    }

    getMePlaylist(playlistID) {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYLIST(playlistID));
    }

    getMePlaylistImages(playlistID) {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYLIST_IMAGES(playlistID));
    }

    getMePlaylists() {
        return this.requestHandler.request("GET", Endpoints.ME_PLAYLISTS);
    }

    getMeTop(type) {
        return this.requestHandler.request("GET", Endpoints.ME_TOP(type));
    }

    getMeTracks() {
        return this.requestHandler.request("GET", Endpoints.ME_TRACKS);
    }

    getMeTracksContains() {
        return this.requestHandler.request("GET", Endpoints.ME_TRACKS_CONTAINS);
    }

    getMeUserPlaylists(userID) {
        return this.requestHandler.request("GET", Endpoints.ME_USER_PLAYLISTS(userID));
    }

    /**
     * Retorna as recomendações Baseadas em Sementes
     * @returns {Promise<>}
     */
    getRecommendations() {
        return this.requestHandler.request("GET", Endpoints.RECOMMENDATIONS);
    }

    /**
     * Retorna uma faixa
     * @returns {Promise<Track>}
     */
    getTrack(trackID) {
        return this.requestHandler.request("GET", Endpoints.TRACK(trackID));
    }

    /**
     * Retorna várias faixas
     * @returns {Promise<[Track]>}
     */
    getTracks() {
        return this.requestHandler.request("GET", Endpoints.TRACKS);
    }

    /**
     * Retorna um perfil de usuário
     * @returns {Promise<User>}
     */
    getUser(userID) {
        return this.requestHandler.request("GET", Endpoints.USER(userID));
    }
}

module.exports = SpotifyAPI;