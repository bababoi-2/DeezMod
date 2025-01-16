"use strict";(self.webpackJsonpDeezer=self.webpackJsonpDeezer||[]).push([[1421],{A2sV:(t,r,e)=>{e.d(r,{$1e:()=>xr,$FS:()=>Xr,$IV:()=>Bt,A22:()=>Pr,AgB:()=>gr,B1A:()=>I,BMS:()=>It,BXP:()=>ve,CwG:()=>Xt,DI4:()=>Yr,DNU:()=>de,Dh1:()=>zr,Dvu:()=>y,Ggf:()=>Jt,H91:()=>ge,Hi1:()=>Wt,HwP:()=>Ee,I7O:()=>Fe,IoY:()=>Zr,JDV:()=>ar,KDJ:()=>mr,LLq:()=>Qt,LQK:()=>Pe,LrA:()=>c,M7C:()=>Le,Mij:()=>a,MmF:()=>ie,N$N:()=>u,N6A:()=>lt,O7r:()=>At,OD9:()=>jt,ONi:()=>Me,ORW:()=>dr,PKC:()=>xe,QNb:()=>Fr,RsC:()=>Dr,SNU:()=>Kt,TF:()=>Tr,T_E:()=>nr,UJq:()=>_t,V9d:()=>pt,Wyk:()=>rr,XAQ:()=>Lr,XBt:()=>Ut,Ypw:()=>qt,ZO1:()=>ut,_At:()=>Te,a40:()=>Re,aZE:()=>vr,by3:()=>l,ct1:()=>g,dj:()=>Ct,efT:()=>ee,epo:()=>Vt,fL0:()=>ce,g1V:()=>zt,gWG:()=>Sr,iqi:()=>o,kqj:()=>Ot,kuS:()=>Rr,l4E:()=>Wr,mAL:()=>Yt,mcr:()=>Mr,nPg:()=>Ne,nZ$:()=>wr,oih:()=>yt,ovp:()=>Nr,qAq:()=>De,rb0:()=>$,rdE:()=>d,sV3:()=>n,sfq:()=>kt,t1v:()=>te,tjO:()=>$r,u0N:()=>ft,vi:()=>m,vjx:()=>ht,w8_:()=>me,weQ:()=>bt,wgW:()=>cr,wi_:()=>sr,x87:()=>Er,xcD:()=>$e,xxF:()=>Ht,y02:()=>ae,yJp:()=>Se,yRK:()=>ur});var s=e("Au7y");const i={};let n=function(t){return t.ALPHA="ALPHA",t.NONE="NONE",t.RANK="RANK",t.RELEASE_DATE="RELEASE_DATE",t}({}),a=function(t){return t.COMPILATION="COMPILATION",t.KARAOKE="KARAOKE",t.LIVE="LIVE",t.STUDIO="STUDIO",t}({}),o=function(t){return t.ALBUM="ALBUM",t.EP="EP",t.SINGLES="SINGLES",t.UNKNOWN="UNKNOWN",t}({}),c=function(t){return t.AUDIO="AUDIO",t.EXPLICIT_CONTENT="EXPLICIT_CONTENT",t.OTHER="OTHER",t.WRONG_ARTIST="WRONG_ARTIST",t}({}),u=function(t){return t.ARTIST_ALREADY_EXIST="ARTIST_ALREADY_EXIST",t.EXPLICIT_CONTENT="EXPLICIT_CONTENT",t.OTHER="OTHER",t.WRONG_PICTURE="WRONG_PICTURE",t}({}),d=function(t){return t.AUDIO="AUDIO",t.EXPLICIT_CONTENT="EXPLICIT_CONTENT",t.OTHER="OTHER",t.WRONG_ARTIST="WRONG_ARTIST",t}({}),l=function(t){return t.FEATURED="FEATURED",t.MAIN="MAIN",t}({}),$=function(t){return t.ALL="ALL",t.NON_OFFICIAL="NON_OFFICIAL",t.OFFICIAL="OFFICIAL",t}({}),I=function(t){return t.DEFAULT="DEFAULT",t.DISCOVERY="DISCOVERY",t}({}),m=function(t){return t.CANCELLED="CANCELLED",t.ENDED="ENDED",t.PENDING="PENDING",t.STARTED="STARTED",t}({}),y=function(t){return t.ARTISTS_PICKER="ARTISTS_PICKER",t.IMPROVE="IMPROVE",t.MUSIC_TOGETHER="MUSIC_TOGETHER",t.WELCOME="WELCOME",t}({}),g=function(t){return t.DEEZER_SESSION="DEEZER_SESSION",t.DOCUMENTARY="DOCUMENTARY",t.INTERVIEW="INTERVIEW",t.REPLAY="REPLAY",t.TRAILER="TRAILER",t}({});const f=s.J1`
	fragment PictureXSmall on Picture {
		id
		xxx_small: urls(pictureRequest: {width: 40, height: 40})
		explicitStatus
	}
`,S=s.J1`
	fragment PlaylistAssistantTrack on Track {
		id
		title
		album {
			id
			displayTitle
			cover {
				...PictureXSmall
			}
		}
		contributors {
			edges {
				node {
					... on Artist {
						id
						name
					}
				}
			}
		}
		duration
		media {
			id
		}
		isExplicit
	}
	${f}
`,p=s.J1`
	fragment SynchronizedLines on Lyrics {
		id
		synchronizedLines {
			lrcTimestamp
			line
			lineTranslated
			milliseconds
			duration
		}
	}
`,T=s.J1`
	fragment SynchronizedWordByWordLines on Lyrics {
		id
		synchronizedWordByWordLines {
			start
			end
			words {
				start
				end
				word
			}
		}
	}
`,A=s.J1`
	fragment PictureSmall on Picture {
		id
		small: urls(pictureRequest: {height: 100, width: 100})
		explicitStatus
	}
`,v=s.J1`
	fragment SidebarPlaylistsInfo on Playlist {
		isFromFavoriteTracks
		isCollaborative
		id
		title
		owner {
			id
			name
		}
		picture {
			...PictureSmall
		}
	}
	${A}
`,h=s.J1`
	fragment AlbumSearchHistory on Album {
		id
		displayTitle
		contributors {
			edges {
				node {
					... on Artist {
						id
						name
					}
				}
			}
		}
		cover {
			...PictureSmall
		}
	}
	${A}
`,P=s.J1`
	fragment ArtistSearchHistory on Artist {
		id
		name
		fansCount
		picture {
			...PictureSmall
		}
	}
	${A}
`,b=s.J1`
	fragment EpisodeSearchHistory on PodcastEpisode {
		id
		title
		publicationDate
		podcast {
			id
			displayTitle
			cover {
				...PictureSmall
			}
		}
	}
	${A}
`,E=s.J1`
	fragment LiveStreamSearchHistory on Livestream {
		id
		name
		isOnStream
		cover {
			...PictureSmall
		}
	}
	${A}
`,C=s.J1`
	fragment PlaylistSearchHistory on Playlist {
		id
		title
		owner {
			id
			name
		}
		picture {
			...PictureSmall
		}
	}
	${A}
`,L=s.J1`
	fragment PodcastSearchHistory on Podcast {
		id
		displayTitle
		description
		cover {
			...PictureSmall
		}
	}
	${A}
`,k=s.J1`
	fragment TrackSearchHistory on Track {
		id
		title
		contributors {
			edges {
				node {
					... on Artist {
						id
						name
					}
				}
			}
		}
		album {
			id
			displayTitle
			cover {
				...PictureSmall
			}
		}
	}
	${A}
`,F=s.J1`
	fragment PictureMedium on Picture {
		id
		medium: urls(pictureRequest: {width: 264, height: 264})
		explicitStatus
	}
`,J=s.J1`
	fragment PictureLarge on Picture {
		id
		large: urls(pictureRequest: {width: 500, height: 500})
		explicitStatus
	}
`,R=s.J1`
	fragment AlbumBase on Album {
		id
		displayTitle
		cover {
			...PictureSmall
			...PictureMedium
			...PictureLarge
		}
		releaseDate
		isFavorite
		isExplicit
	}
	${A}
	${F}
	${J}
`,q=s.J1`
	fragment AlbumContributors on Album {
		contributors {
			edges {
				cursor
				roles
				node {
					... on Artist {
						id
						name
						picture {
							...PictureSmall
							...PictureMedium
							...PictureLarge
						}
						isFavorite
						fansCount
					}
				}
			}
		}
	}
	${A}
	${F}
	${J}
`,N=s.J1`
	fragment AlbumMasthead on Album {
		...AlbumBase
		...AlbumContributors
		duration
		fansCount
	}
	${R}
	${q}
`,O=s.J1`
	fragment ArtistConcert on Artist {
		concerts(first: 1) {
			edges {
				node {
					id
					name
					date
					location
				}
			}
		}
	}
`,x=s.J1`
	fragment ArtistLiveEvents on Artist {
		liveEvents(
			first: $liveEventsFirst
			types: [CONCERT, FESTIVAL]
			statuses: [PENDING]
		) {
			edges {
				node {
					id
					name
					startDate
					cityName
					countryCode
					types {
						isConcert
						isFestival
						isLivestreamConcert
						isLivestreamFestival
					}
					venue
				}
			}
			pageInfo {
				endCursor
				hasNextPage
			}
		}
	}
`,_=s.J1`
	fragment ArtistLiveEventsByProximity on Artist {
		liveEventsByProximity(first: $liveEventsByProximityFirst) {
			edges {
				node {
					id
					name
					startDate
					cityName
					countryCode
					types {
						isConcert
						isFestival
						isLivestreamConcert
						isLivestreamFestival
					}
					venue
				}
			}
		}
	}
`,D=s.J1`
	fragment ArtistBase on Artist {
		id
		name
		fansCount
		hasSmartRadio
		isFavorite
		picture {
			...PictureSmall
			...PictureMedium
			...PictureLarge
		}
	}
	${A}
	${F}
	${J}
`,B=s.J1`
	fragment ArtistBio on Artist {
		bio {
			full
		}
	}
`,M=s.J1`
	fragment ArtistSocial on Artist {
		social {
			twitter
			facebook
			website
		}
	}
`,U=s.J1`
	fragment ArtistMasthead on Artist {
		...ArtistBase
		...ArtistBio
		...ArtistSocial
		onTour
		status
	}
	${D}
	${B}
	${M}
`,w=s.J1`
	fragment PlaylistBase on Playlist {
		id
		picture {
			...PictureSmall
			...PictureMedium
			...PictureLarge
		}
		title
	}
	${A}
	${F}
	${J}
`,H=s.J1`
	fragment SearchArtist on Artist {
		id
		isFavorite
		name
		fansCount
		picture {
			...PictureLarge
		}
	}
	${J}
`,W=s.J1`
	fragment BestResultArtist on Artist {
		...SearchArtist
		hasSmartRadio
		hasTopTracks
	}
	${H}
`,G=s.J1`
	fragment SearchAlbum on Album {
		id
		displayTitle
		isFavorite
		releaseDateAlbum: releaseDate
		isExplicitAlbum: isExplicit
		cover {
			...PictureLarge
		}
		contributors {
			edges {
				roles
				node {
					... on Artist {
						id
						name
					}
				}
			}
		}
		tracksCount
	}
	${J}
`,z=s.J1`
	fragment SearchChannel on Channel {
		id
		picture {
			...PictureLarge
		}
		logoAsset {
			id
			large: urls(uiAssetRequest: {width: 500, height: 0})
		}
		name
		slug
		backgroundColor
	}
	${J}
`,V=s.J1`
	fragment SearchFlowConfig on FlowConfig {
		id
		title
		visuals {
			dynamicPageIcon {
				id
				large: urls(uiAssetRequest: {width: 500, height: 500})
			}
		}
	}
`,X=s.J1`
	fragment SearchLivestream on Livestream {
		id
		name
		cover {
			...PictureLarge
		}
	}
	${J}
`,K=s.J1`
	fragment SearchPlaylist on Playlist {
		id
		title
		isFavorite
		estimatedTracksCount
		fansCount
		picture {
			...PictureLarge
		}
		owner {
			id
			name
		}
	}
	${J}
`,Y=s.J1`
	fragment SearchPodcast on Podcast {
		id
		displayTitle
		isPodcastFavorite: isFavorite
		cover {
			...PictureLarge
		}
		isExplicit
		rawEpisodes
	}
	${J}
`,j=s.J1`
	fragment SearchPodcastEpisode on PodcastEpisode {
		id
		title
		description
		duration
		releaseDate
		media {
			url
		}
		podcast {
			id
			displayTitle
			isExplicit
			cover {
				...PictureSmall
				...PictureLarge
			}
			rights {
				ads {
					available
				}
				sub {
					available
				}
			}
		}
	}
	${A}
	${J}
`,Z=s.J1`
	fragment SearchUser on User {
		id
		name
		picture {
			...PictureLarge
		}
	}
	${J}
`,Q=s.J1`
	fragment TrackLyrics on Track {
		id
		lyrics {
			id
			copyright
			synchronizedLines {
				line
			}
			text
			writers
		}
	}
`,tt=s.J1`
	fragment TrackContributors on Track {
		contributors {
			edges {
				cursor
				roles
				node {
					... on Artist {
						id
						name
						picture {
							...PictureSmall
							...PictureMedium
							...PictureLarge
						}
					}
				}
			}
		}
	}
	${A}
	${F}
	${J}
`,rt=s.J1`
	fragment TrackBase on Track {
		id
		title
		...TrackContributors
		album {
			id
			displayTitle
			cover {
				...PictureSmall
				...PictureMedium
				...PictureLarge
			}
		}
	}
	${tt}
	${A}
	${F}
	${J}
`,et=s.J1`
	fragment TrackMasthead on Track {
		...TrackBase
		duration
		isExplicit
	}
	${rt}
`,st=s.J1`
	fragment TrackRelatedAlbums on Track {
		relatedTracks(first: $relatedAlbumsFirst) {
			edges {
				node {
					...TrackBase
					album {
						...AlbumBase
						id
						contributors(first: $relatedAlbumsContributorsFirst) {
							edges {
								node {
									... on Artist {
										id
										name
									}
								}
							}
						}
						releaseDate
					}
				}
			}
		}
	}
	${rt}
	${R}
`,it=s.J1`
	fragment LyricsSynchronizedLines on LyricsSynchronizedLine {
		lrcTimestamp
		line
		lineTranslated
		milliseconds
		duration
	}
`,nt=s.J1`
	fragment Lyrics on Lyrics {
		id
		copyright
		text
		writers
		synchronizedLines {
			...LyricsSynchronizedLines
		}
	}
	${it}
`,at=s.J1`
	fragment SynchronizedTrackLyrics on Track {
		id
		lyrics {
			...Lyrics
		}
		album {
			cover {
				...PictureSmall
				...PictureMedium
				...PictureLarge
			}
		}
	}
	${nt}
	${A}
	${F}
	${J}
`,ot=s.J1`
	fragment TableTrack on Track {
		id
		title
		duration
		popularity
		isExplicit
		lyrics {
			id
		}
		media {
			id
			rights {
				ads {
					available
					availableAfter
				}
				sub {
					available
					availableAfter
				}
			}
		}
		album {
			id
			displayTitle
			cover {
				...PictureXSmall
				...PictureLarge
			}
		}
		contributors {
			edges {
				node {
					... on Artist {
						id
						name
					}
				}
			}
		}
	}
	${f}
	${J}
`,ct=s.J1`
	query SimpleStory($storyId: String!) {
		me {
			simpleStory(storyId: $storyId) {
				storyId
				placeholders {
					key
					value
				}
			}
		}
	}
`;function ut(t){const r={...i,...t};return s.IT(ct,r)}const dt=s.J1`
	query SearchResult($city: String!) {
		search(query: $city) {
			results {
				cities {
					edges {
						node {
							name
							countryCode
							coordinates {
								latitude
								longitude
							}
						}
					}
				}
			}
		}
	}
`;function lt(t){const r={...i,...t};return s._l(dt,r)}const $t=s.J1`
	mutation SubscribeToLiveEventNotification($eventId: String!) {
		subscribeToLiveEventNotification(liveEventId: $eventId) {
			status
			liveEvent {
				id
				hasSubscribedToNotification
			}
		}
	}
`;function It(t){const r={...i,...t};return s.n_($t,r)}const mt=s.J1`
	mutation UnsubscribeToLiveEventNotification($eventId: String!) {
		unsubscribeToLiveEventNotification(liveEventId: $eventId) {
			status
			liveEvent {
				id
				hasSubscribedToNotification
			}
		}
	}
`;function yt(t){const r={...i,...t};return s.n_(mt,r)}const gt=s.J1`
	query LiveEventCard(
		$eventId: String!
		$imageHeight: Int!
		$imageWidth: Int!
	) {
		liveEvent(liveEventId: $eventId) {
			id
			name
			startDate
			status
			live {
				id
				externalUrl {
					url
				}
			}
			videos(types: [TRAILER]) {
				edges {
					node {
						id
						externalUrl {
							url
						}
						type
					}
				}
			}
			assets {
				eventCardImageWeb {
					id
					urls(pictureRequest: {height: $imageHeight, width: $imageWidth})
				}
			}
			hasSubscribedToNotification
		}
	}
`;function ft(t){const r={...i,...t};return s.IT(gt,r)}const St=s.J1`
	query ArtistsPickerOnboardingStepInfo($context: OnboardingContextInput) {
		onboardingSteps(context: $context) {
			artistsPicker {
				minimumArtistsToPick
				maximumArtistsToPick
				displayGenreBar
			}
		}
	}
`;function pt(t){const r={...i,...t};return s.IT(St,r)}const Tt=s.J1`
	mutation ValidateOnboardingArtistsPickerStep(
		$artistIds: [String!]!
		$context: OnboardingContextInput!
	) {
		validateOnboardingArtistsPickerStep(
			input: {artistIds: $artistIds}
			context: $context
		) {
			status
			onboarding {
				currentStep
				shouldBeOnboarded
			}
		}
	}
`;function At(t){const r={...i,...t};return s.n_(Tt,r)}const vt=s.J1`
	query ImportLibraryOnboardingStepInfo {
		onboardingSteps {
			importLibrary {
				title
				skipCTA
				importer
				supportedServices
			}
		}
	}
`;function ht(t){const r={...i,...t};return s.IT(vt,r)}const Pt=s.J1`
	mutation ValidateOnboardingLibraryImportStep(
		$hasSkipped: Boolean!
		$context: OnboardingContextInput!
	) {
		validateOnboardingImportLibraryStep(
			input: {hasSkipped: $hasSkipped}
			context: $context
		) {
			status
			onboarding {
				currentStep
				shouldBeOnboarded
			}
		}
	}
`;function bt(t){const r={...i,...t};return s.n_(Pt,r)}const Et=s.J1`
	query PlaylistAssistantRecommendedTracks($playlistId: String!) {
		playlist(playlistId: $playlistId) {
			id
			playlistAssistant {
				sources {
					id
					title
					tracks {
						...PlaylistAssistantTrack
					}
				}
			}
		}
	}
	${S}
`;function Ct(t){const r={...i,...t};return s.IT(Et,r)}const Lt=s.J1`
	query SearchTracks($value: String!, $first: Int!) {
		search(query: $value) {
			results {
				tracks(first: $first) {
					edges {
						node {
							...PlaylistAssistantTrack
						}
					}
				}
			}
		}
	}
	${S}
`;function kt(t){const r={...i,...t};return s.IT(Lt,r)}const Ft=s.J1`
	mutation ReportIssueOfCatalog($input: CatalogIssueInput!) {
		reportCatalogIssue(input: $input) {
			... on ReportCatalogIssueMutationOutput {
				success
			}
		}
	}
`;function Jt(t){const r={...i,...t};return s.n_(Ft,r)}const Rt=s.J1`
	query GetLyrics($trackId: String!) {
		track(trackId: $trackId) {
			id
			lyrics {
				id
				text
				...SynchronizedWordByWordLines
				...SynchronizedLines
				copyright
				writers
			}
		}
	}
	${T}
	${p}
`;function qt(t){const r={...i,...t};return s.IT(Rt,r)}s.J1`
	query SynchronizedLyricsLines($trackId: String!) {
		track(trackId: $trackId) {
			id
			lyrics {
				id
				...SynchronizedLines
			}
		}
	}
	${p}
`,s.J1`
	query SynchronizedLyricsWordByWord($trackId: String!) {
		track(trackId: $trackId) {
			id
			lyrics {
				id
				...SynchronizedWordByWordLines
			}
		}
	}
	${T}
`;const Nt=s.J1`
	query TrackCover($trackId: String!) {
		track(trackId: $trackId) {
			id
			album {
				id
				cover {
					...PictureLarge
				}
			}
		}
	}
	${J}
`;function Ot(t){const r={...i,...t};return s.IT(Nt,r)}s.J1`
	query UnsynchronizedLyricsLines($trackId: String!) {
		track(trackId: $trackId) {
			id
			lyrics {
				id
				text
			}
		}
	}
`;const xt=s.J1`
	query Tuner {
		me {
			id
			flowTuner {
				discoveryTuner
			}
		}
	}
`;function _t(t){const r={...i,...t};return s.UX(xt,r)}const Dt=s.J1`
	mutation AddTracksToPlaylist($input: PlaylistAddTracksMutationInput!) {
		addTracksToPlaylist(input: $input) {
			... on PlaylistAddTracksOutput {
				addedTrackIds
				duplicatedTrackIds
			}
		}
	}
`;function Bt(t){const r={...i,...t};return s.n_(Dt,r)}s.J1`
	query SidebarInfo($first: Int!) {
		me {
			userFavorites {
				estimatedTracksCount
				estimatedAlbumsCount
				albums(first: $first) {
					edges {
						node {
							id
							displayTitle
							cover {
								...PictureMedium
							}
						}
					}
				}
				estimatedArtistsCount
				artists(first: $first) {
					edges {
						node {
							id
							name
							picture {
								...PictureMedium
							}
						}
					}
				}
				estimatedPodcastsCount
				podcasts(first: $first) {
					edges {
						node {
							id
							displayTitle
							cover {
								...PictureMedium
							}
						}
					}
				}
			}
		}
	}
	${F}
`;const Mt=s.J1`
	query SidebarPlaylistsInfo($first: Int!) {
		me {
			id
			playlists(sort: {by: LAST_MODIFICATION_DATE, order: DESC}) {
				edges {
					node {
						lastModificationDate
						...SidebarPlaylistsInfo
					}
				}
			}
			userFavorites {
				playlists(first: $first) {
					edges {
						favoritedAt
						node {
							...SidebarPlaylistsInfo
						}
					}
				}
			}
		}
	}
	${v}
`;function Ut(t){const r={...i,...t};return s.IT(Mt,r)}const wt=s.J1`
	query IsPlaylistBlindtestable($playlistId: String!) {
		playlist(playlistId: $playlistId) {
			id
			isBlindTestable
		}
	}
`;function Ht(t){const r={...i,...t};return s.IT(wt,r)}function Wt(t){const r={...i,...t};return s.UX(wt,r)}const Gt=s.J1`
	mutation ClearSearchHistory {
		clearSearchSuccessResult {
			status
		}
	}
`;function zt(t){const r={...i,...t};return s.n_(Gt,r)}const Vt=s.J1`
	query History($first: Int, $cursor: String) {
		me {
			id
			searchHistory {
				successResults(first: $first, after: $cursor) {
					pageInfo {
						hasNextPage
						endCursor
					}
					edges {
						node {
							... on Track {
								...TrackSearchHistory
							}
							... on PodcastEpisode {
								...EpisodeSearchHistory
							}
							... on Livestream {
								...LiveStreamSearchHistory
							}
							... on Artist {
								...ArtistSearchHistory
							}
							... on Playlist {
								...PlaylistSearchHistory
							}
							... on Album {
								...AlbumSearchHistory
							}
							... on Podcast {
								...PodcastSearchHistory
							}
						}
					}
				}
			}
		}
	}
	${k}
	${b}
	${E}
	${P}
	${C}
	${h}
	${L}
`;function Xt(t){const r={...i,...t};return s.IT(Vt,r)}function Kt(t){const r={...i,...t};return s._l(Vt,r)}const Yt=s.J1`
	query AlbumFull($albumId: String!) {
		album(albumId: $albumId) {
			...AlbumMasthead
		}
	}
	${N}
`;function jt(t){const r={...i,...t};return s.IT(Yt,r)}const Zt=s.J1`
	query AlternativeAlbumVersions($albumId: String!) {
		album(albumId: $albumId) {
			alternativeVersions {
				edges {
					node {
						...AlbumBase
						...AlbumContributors
					}
				}
			}
		}
	}
	${R}
	${q}
`;function Qt(t){const r={...i,...t};return s.IT(Zt,r)}const tr=s.J1`
	query ArtistBiography($artistId: String!) {
		artist(artistId: $artistId) {
			id
			name
			...ArtistBio
		}
	}
	${B}
`;function rr(t){const r={...i,...t};return s.IT(tr,r)}const er=s.J1`
	query ArtistCuratedPlaylists(
		$artistId: String!
		$curatedPlaylistFirst: Int!
	) {
		artist(artistId: $artistId) {
			id
			playlists {
				curatedPlaylists(first: $curatedPlaylistFirst) {
					edges {
						node {
							...PlaylistBase
							fansCount
							owner {
								id
								name
							}
							estimatedTracksCount
							isPrivate
							isCollaborative
						}
					}
				}
			}
		}
	}
	${w}
`;function sr(t){const r={...i,...t};return s.IT(er,r)}const ir=s.J1`
	query ArtistDiscographyByType(
		$artistId: String!
		$nb: Int!
		$roles: [ContributorRoles!]!
		$types: [AlbumTypeInput!]!
		$subType: AlbumSubTypeInput
		$mode: DiscographyMode
		$cursor: String
		$order: AlbumOrder
	) {
		artist(artistId: $artistId) {
			id
			albums(
				after: $cursor
				first: $nb
				onlyCanonical: true
				roles: $roles
				types: $types
				subType: $subType
				mode: $mode
				order: $order
			) {
				edges {
					cursor
					node {
						...AlbumBase
						...AlbumContributors
					}
				}
				pageInfo {
					hasNextPage
					hasPreviousPage
					startCursor
					endCursor
				}
			}
		}
	}
	${R}
	${q}
`;function nr(t){const r={...i,...t};return s.IT(ir,r)}function ar(t){const r={...i,...t};return s.UX(ir,r)}const or=s.J1`
	query ArtistFull(
		$artistId: String!
		$relatedArtistFirst: Int!
		$liveEventsFirst: Int!
	) {
		artist(artistId: $artistId) {
			...ArtistMasthead
			relatedArtists: relatedArtist(first: $relatedArtistFirst) {
				edges {
					cursor
					node {
						...ArtistBase
					}
				}
				pageInfo {
					hasNextPage
					hasPreviousPage
					startCursor
					endCursor
				}
			}
			liveEvents(
				first: $liveEventsFirst
				types: [CONCERT, FESTIVAL]
				statuses: [PENDING]
			) {
				edges {
					node {
						id
					}
				}
				pageInfo {
					endCursor
					hasNextPage
				}
			}
		}
		me {
			userFavorites {
				byArtist(artistId: $artistId) {
					estimatedTracksCount
				}
			}
		}
	}
	${U}
	${D}
`;function cr(t){const r={...i,...t};return s.IT(or,r)}const ur=s.J1`
	query ArtistRelatedArtists(
		$artistId: String!
		$relatedArtistFirst: Int!
		$cursor: String
	) {
		artist(artistId: $artistId) {
			id
			relatedArtists: relatedArtist(
				first: $relatedArtistFirst
				after: $cursor
			) {
				edges {
					cursor
					node {
						...ArtistBase
					}
				}
				pageInfo {
					hasNextPage
					hasPreviousPage
					startCursor
					endCursor
				}
			}
		}
	}
	${D}
`;function dr(t){const r={...i,...t};return s.IT(ur,r)}const lr=s.J1`
	query ArtistRelatedPlaylists(
		$artistId: String!
		$relatedPlaylistFirst: Int!
		$cursor: String
	) {
		artist(artistId: $artistId) {
			id
			playlists {
				relatedPlaylists(first: $relatedPlaylistFirst, after: $cursor) {
					edges {
						cursor
						node {
							...PlaylistBase
							fansCount
							owner {
								id
								name
							}
							estimatedTracksCount
							isPrivate
							isCollaborative
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${w}
`;function $r(t){const r={...i,...t};return s.IT(lr,r)}s.J1`
	query ConcertList($artistId: String!, $perPage: Int = 70) {
		artist(artistId: $artistId) {
			id
			concerts(first: $perPage) {
				edges {
					node {
						id
						name
						date
						location
					}
				}
			}
		}
	}
`,s.J1`
	query LastConcert($artistId: String!) {
		artist(artistId: $artistId) {
			id
			name
			...ArtistConcert
		}
	}
	${O}
`;const Ir=s.J1`
	query LastLiveEvent(
		$artistId: String!
		$liveEventsByProximityFirst: Int = 1
	) {
		artist(artistId: $artistId) {
			id
			name
			...ArtistLiveEventsByProximity
		}
	}
	${_}
`;function mr(t){const r={...i,...t};return s.IT(Ir,r)}const yr=s.J1`
	query LiveEventList($artistId: String!, $liveEventsFirst: Int!) {
		artist(artistId: $artistId) {
			id
			name
			...ArtistLiveEvents
		}
	}
	${x}
`;function gr(t){const r={...i,...t};return s.IT(yr,r)}const fr=s.J1`
	query PersonalFavoriteByArtist(
		$artistId: String!
		$first: Int!
		$cursor: String
	) {
		me {
			userFavorites {
				byArtist(artistId: $artistId) {
					tracks(after: $cursor, first: $first) {
						edges {
							cursor
							favoritedAt
							node {
								...TableTrack
							}
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			}
		}
	}
	${ot}
`;function Sr(t){const r={...i,...t};return s.IT(fr,r)}const pr=s.J1`
	query PersonalFavoriteCount($artistId: String!) {
		artist(artistId: $artistId) {
			picture {
				...PictureSmall
			}
		}
		me {
			userFavorites {
				byArtist(artistId: $artistId) {
					estimatedTracksCount
				}
			}
		}
	}
	${A}
`;function Tr(t){const r={...i,...t};return s.IT(pr,r)}const Ar=s.J1`
	query LiveEvent(
		$eventId: String!
		$contributorsFirst: Int = 12
		$albumFirst: Int = 12
	) {
		liveEvent(liveEventId: $eventId) {
			id
			name
			startDate
			status
			venue
			cityName
			hasSubscribedToNotification
			sources {
				coBranding {
					logoAsset {
						lightThemeUIAsset {
							id
							urls(uiAssetRequest: {width: 730, height: 182})
						}
						darkThemeUIAsset {
							id
							urls(uiAssetRequest: {width: 730, height: 182})
						}
					}
				}
				defaultUrl
			}
			live {
				id
				externalUrl {
					url
				}
			}
			types {
				isConcert
				isFestival
				isLivestreamConcert
				isLivestreamFestival
			}
			videos(types: [TRAILER]) {
				edges {
					node {
						id
						externalUrl {
							url
						}
						type
					}
				}
			}
			contributors(first: $contributorsFirst) {
				edges {
					concertContributorMetadata {
						roles {
							isMain
							isSupport
						}
						performanceOrder
					}
					cursor
					node {
						... on Artist {
							id
							name
							isFavorite
							fansCount
							albums(
								types: [ALBUM]
								order: RELEASE_DATE
								mode: OFFICIAL
								roles: [MAIN]
								first: $albumFirst
								after: null
							) {
								edges {
									cursor
									node {
										id
										displayTitle
										releaseDate
										cover {
											md5
											...PictureSmall
											...PictureMedium
											...PictureLarge
										}
									}
								}
							}
							picture {
								md5
								...PictureSmall
								...PictureMedium
								...PictureLarge
							}
							url {
								webUrl
								deepLink
							}
							isFavorite
							fansCount
						}
					}
				}
				pageInfo {
					hasNextPage
					startCursor
					hasPreviousPage
				}
			}
		}
	}
	${A}
	${F}
	${J}
`;function vr(t){const r={...i,...t};return s.IT(Ar,r)}const hr=s.J1`
	query LiveEventsRecommended(
		$longitude: Float = null
		$latitude: Float = null
		$first: Int
		$after: String
	) {
		liveEventsRecommended(
			longitude: $longitude
			latitude: $latitude
			first: $first
			after: $after
		) {
			pageInfo {
				endCursor
				hasNextPage
			}
			edges {
				cursor
				node {
					id
					types {
						isConcert
						isFestival
						isLivestreamConcert
						isLivestreamFestival
					}
					startDate
					status
					venue
					hasSubscribedToNotification
					name
					sources {
						songkick {
							id
						}
					}
					contributors(first: 10, after: null) {
						edges {
							cursor
							node {
								... on Artist {
									id
									name
									fansCount
									isFavorite
									picture {
										...PictureSmall
										...PictureMedium
										...PictureLarge
									}
									url {
										webUrl
										deepLink
									}
								}
							}
							concertContributorMetadata {
								roles {
									isMain
								}
							}
						}
						pageInfo {
							hasNextPage
							startCursor
							hasPreviousPage
							endCursor
						}
					}
				}
			}
		}
	}
	${A}
	${F}
	${J}
`;function Pr(t){const r={...i,...t};return s.IT(hr,r)}const br=s.J1`
	query OthersFavorite($userId: String!) {
		user(userId: $userId) {
			id
			favorites {
				estimatedTracksCount
			}
		}
	}
`;function Er(t){const r={...i,...t};return s.UX(br,r)}const Cr=s.J1`
	query PlaylistCover($playlistId: String!) {
		playlist(playlistId: $playlistId) {
			...PlaylistBase
			isPrivate
			isFromFavoriteTracks
		}
	}
	${w}
`;function Lr(t){const r={...i,...t};return s.IT(Cr,r)}const kr=s.J1`
	mutation AddAlbumInSearchHistory($albumId: String!) {
		addAlbumInSearchSuccessResult(albumId: $albumId) {
			status
		}
	}
`;function Fr(t){const r={...i,...t};return s.n_(kr,r)}const Jr=s.J1`
	mutation AddArtistInSearchHistory($artistId: String!) {
		addArtistInSearchSuccessResult(artistId: $artistId) {
			status
		}
	}
`;function Rr(t){const r={...i,...t};return s.n_(Jr,r)}const qr=s.J1`
	mutation AddTrackInSearchHistory($trackId: String!) {
		addTrackInSearchSuccessResult(trackId: $trackId) {
			status
		}
	}
`;function Nr(t){const r={...i,...t};return s.n_(qr,r)}const Or=s.J1`
	mutation AddPlaylistInSearchHistory($playlistId: String!) {
		addPlaylistInSearchSuccessResult(playlistId: $playlistId) {
			status
		}
	}
`;function xr(t){const r={...i,...t};return s.n_(Or,r)}const _r=s.J1`
	mutation AddPodcastInSearchHistory($podcastId: String!) {
		addPodcastInSearchSuccessResult(podcastId: $podcastId) {
			status
		}
	}
`;function Dr(t){const r={...i,...t};return s.n_(_r,r)}const Br=s.J1`
	mutation AddPodcastEpisodeInSearchHistory($episodeId: String!) {
		addPodcastEpisodeInSearchSuccessResult(episodeId: $episodeId) {
			status
		}
	}
`;function Mr(t){const r={...i,...t};return s.n_(Br,r)}const Ur=s.J1`
	mutation AddLivestreamInSearchHistory($livestreamId: String!) {
		addLivestreamInSearchSuccessResult(livestreamId: $livestreamId) {
			status
		}
	}
`;function wr(t){const r={...i,...t};return s.n_(Ur,r)}const Hr=s.J1`
	query SearchAlbumsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				albums(first: $first, after: $cursor) {
					edges {
						node {
							...SearchAlbum
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${G}
`;function Wr(t){const r={...i,...t};return s.IT(Hr,r)}const Gr=s.J1`
	query SearchArtistsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				artists(first: $first, after: $cursor) {
					edges {
						node {
							...SearchArtist
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${H}
`;function zr(t){const r={...i,...t};return s.IT(Gr,r)}const Vr=s.J1`
	query SearchChannelsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				channels(first: $first, after: $cursor) {
					edges {
						node {
							...SearchChannel
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${z}
`;function Xr(t){const r={...i,...t};return s.IT(Vr,r)}const Kr=s.J1`
	query SearchEpisodesTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				podcastEpisodes(first: $first, after: $cursor) {
					edges {
						node {
							...SearchPodcastEpisode
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${j}
`;function Yr(t){const r={...i,...t};return s.IT(Kr,r)}const jr=s.J1`
	query SearchFlowConfigsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				flowConfigs(first: $first, after: $cursor) {
					edges {
						node {
							...SearchFlowConfig
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${V}
`;function Zr(t){const r={...i,...t};return s.IT(jr,r)}const Qr=s.J1`
	query SearchFull($query: String!, $firstGrid: Int!, $firstList: Int!) {
		instantSearch(query: $query) {
			bestResult {
				__typename
				... on InstantSearchAlbumBestResult {
					album {
						...SearchAlbum
					}
				}
				... on InstantSearchArtistBestResult {
					artist {
						...BestResultArtist
					}
				}
				... on InstantSearchPlaylistBestResult {
					playlist {
						...SearchPlaylist
					}
				}
				... on InstantSearchPodcastBestResult {
					podcast {
						...SearchPodcast
					}
				}
				... on InstantSearchLivestreamBestResult {
					livestream {
						...SearchLivestream
					}
				}
				... on InstantSearchTrackBestResult {
					track {
						...TableTrack
					}
				}
				... on InstantSearchPodcastEpisodeBestResult {
					podcastEpisode {
						...SearchPodcastEpisode
					}
				}
			}
			results {
				artists(first: $firstGrid) {
					edges {
						node {
							...SearchArtist
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				albums(first: $firstGrid) {
					edges {
						node {
							...SearchAlbum
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				channels(first: $firstGrid) {
					edges {
						node {
							...SearchChannel
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				flowConfigs(first: $firstGrid) {
					edges {
						node {
							...SearchFlowConfig
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				livestreams(first: $firstGrid) {
					edges {
						node {
							...SearchLivestream
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				playlists(first: $firstGrid) {
					edges {
						node {
							...SearchPlaylist
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				podcasts(first: $firstGrid) {
					edges {
						node {
							...SearchPodcast
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				tracks(first: $firstList) {
					edges {
						node {
							...TableTrack
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				users(first: $firstGrid) {
					edges {
						node {
							...SearchUser
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
				podcastEpisodes(first: $firstList) {
					edges {
						node {
							...SearchPodcastEpisode
						}
					}
					pageInfo {
						endCursor
					}
					priority
				}
			}
		}
	}
	${G}
	${W}
	${K}
	${Y}
	${X}
	${ot}
	${j}
	${H}
	${z}
	${V}
	${Z}
`;function te(t){const r={...i,...t};return s.IT(Qr,r)}const re=s.J1`
	query SearchLivestreamsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				livestreams(first: $first, after: $cursor) {
					edges {
						node {
							...SearchLivestream
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${X}
`;function ee(t){const r={...i,...t};return s.IT(re,r)}const se=s.J1`
	query SearchPlaylistsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				playlists(first: $first, after: $cursor) {
					edges {
						node {
							...SearchPlaylist
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${K}
`;function ie(t){const r={...i,...t};return s.IT(se,r)}const ne=s.J1`
	query SearchPodcastsTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				podcasts(first: $first, after: $cursor) {
					edges {
						node {
							...SearchPodcast
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${Y}
`;function ae(t){const r={...i,...t};return s.IT(ne,r)}s.J1`
	query SearchTopResult($query: String!) {
		instantSearch(query: $query) {
			topResult {
				content {
					...SearchAlbum
					...SearchArtist
					...SearchPlaylist
					...SearchPodcast
					...SearchLivestream
				}
			}
		}
	}
	${G}
	${H}
	${K}
	${Y}
	${X}
`;const oe=s.J1`
	query SearchTracksTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				tracks(first: $first, after: $cursor) {
					edges {
						node {
							...TableTrack
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${ot}
`;function ce(t){const r={...i,...t};return s.IT(oe,r)}const ue=s.J1`
	query SearchUsersTab($query: String!, $first: Int, $cursor: String) {
		instantSearch(query: $query) {
			results {
				users(first: $first, after: $cursor) {
					edges {
						node {
							...SearchUser
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}
	}
	${Z}
`;function de(t){const r={...i,...t};return s.IT(ue,r)}const le=s.J1`
	query SynchronizedTrackLyrics($trackId: String!) {
		track(trackId: $trackId) {
			...SynchronizedTrackLyrics
		}
	}
	${at}
`;function $e(t){const r={...i,...t};return s._l(le,r)}const Ie=s.J1`
	query TrackFull(
		$trackId: String!
		$relatedAlbumsFirst: Int
		$relatedAlbumsContributorsFirst: Int
	) {
		track(trackId: $trackId) {
			...TrackMasthead
			...TrackLyrics
			...TrackRelatedAlbums
		}
	}
	${et}
	${Q}
	${st}
`;function me(t){const r={...i,...t};return s.IT(Ie,r)}const ye=s.J1`
	query TrackLyrics($trackId: String!) {
		track(trackId: $trackId) {
			...TrackLyrics
		}
	}
	${Q}
`;function ge(t){const r={...i,...t};return s.IT(ye,r)}const fe=s.J1`
	query TrackRelatedAlbums(
		$trackId: String!
		$relatedAlbumsFirst: Int
		$relatedAlbumsContributorsFirst: Int
	) {
		track(trackId: $trackId) {
			...TrackRelatedAlbums
		}
	}
	${st}
`;function Se(t){const r={...i,...t};return s.IT(fe,r)}const pe=s.J1`
	mutation AddAlbumToFavorite($albumId: String!) {
		addAlbumToFavorite(albumId: $albumId) {
			album {
				id
				isFavorite
			}
		}
	}
`;function Te(t){const r={...i,...t};return s.n_(pe,r)}const Ae=s.J1`
	mutation AddArtistFavorite($artistId: String!) {
		addArtistToFavorite(artistId: $artistId) {
			favoritedAt
			artist {
				id
				isFavorite
			}
		}
	}
`;function ve(t){const r={...i,...t};return s.n_(Ae,r)}const he=s.J1`
	mutation AddPlaylistToFavorite($playlistId: String!) {
		addPlaylistToFavorite(playlistId: $playlistId) {
			playlist {
				id
				isFavorite
			}
		}
	}
`;function Pe(t){const r={...i,...t};return s.n_(he,r)}const be=s.J1`
	mutation AddPodcastToFavorite($podcastId: String!) {
		addPodcastToFavorite(podcastId: $podcastId) {
			podcast {
				id
				isPodcastFavorite: isFavorite
			}
		}
	}
`;function Ee(t){const r={...i,...t};return s.n_(be,r)}const Ce=s.J1`
	mutation AddTrackToFavorite($trackId: String!) {
		addTrackToFavorite(trackId: $trackId) {
			track {
				id
				isFavorite
			}
		}
	}
`;function Le(t){const r={...i,...t};return s.n_(Ce,r)}const ke=s.J1`
	mutation RemoveAlbumFromFavorite($albumId: String!) {
		removeAlbumFromFavorite(albumId: $albumId) {
			album {
				id
				isFavorite
			}
		}
	}
`;function Fe(t){const r={...i,...t};return s.n_(ke,r)}const Je=s.J1`
	mutation RemoveArtistFromFavorite($artistId: String!) {
		removeArtistFromFavorite(artistId: $artistId) {
			artist {
				id
				isFavorite
			}
		}
	}
`;function Re(t){const r={...i,...t};return s.n_(Je,r)}const qe=s.J1`
	mutation RemovePlaylistFromFavorite($playlistId: String!) {
		removePlaylistFromFavorite(playlistId: $playlistId) {
			playlist {
				id
				isFavorite
			}
		}
	}
`;function Ne(t){const r={...i,...t};return s.n_(qe,r)}const Oe=s.J1`
	mutation RemovePodcastFromFavorite($podcastId: String!) {
		removePodcastFromFavorite(podcastId: $podcastId) {
			podcast {
				id
				isPodcastFavorite: isFavorite
			}
		}
	}
`;function xe(t){const r={...i,...t};return s.n_(Oe,r)}const _e=s.J1`
	mutation RemoveTrackFromFavorite($trackId: String!) {
		removeTrackFromFavorite(trackId: $trackId) {
			track {
				id
				isFavorite
			}
		}
	}
`;function De(t){const r={...i,...t};return s.n_(_e,r)}const Be=s.J1`
	query Me {
		me {
			id
			onboarding {
				currentStep
				shouldBeOnboarded
			}
			user {
				id
			}
		}
	}
`;function Me(t){const r={...i,...t};return s.IT(Be,r)}}}]);