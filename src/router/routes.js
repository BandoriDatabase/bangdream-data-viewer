
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'index', path: '', component: () => import('pages/index') },
      { name: 'cardList', path: 'card/overview/:server(\\S{2})', component: () => import('pages/card-list') },
      { name: 'cardDetail', path: 'card/:server(\\S{2})/:situationId(\\d+)', component: () => import('pages/card-detail') },
      { name: 'scenario', path: 'scenario/:server(\\S{2})/:scenarioType/:scenarioName', component: () => import('pages/scenario') },
      { name: 'sfc', path: 'sfcs/:server(\\S{2})', component: () => import('pages/single-frame-cartoon') },
      { name: 'ffc', path: 'ffcs/:server(\\S{2})', component: () => import('pages/four-frame-cartoon') },
      { name: 'musicList', path: 'music/:server(\\S{2})', component: () => import('pages/music-list') },
      { name: 'musicDetail', path: 'music/:server(\\S{2})/:musicId(\\d+)', component: () => import('pages/music-detail') },
      { name: 'musicBeatmap', path: 'music/:server(\\S{2})/:musicId(\\d+)/beatmap', component: () => import('pages/music-beatmap') },
      { name: 'live2d', path: 'l2d/:server(\\S{2})/:costumeId(\\d+)?', component: () => import('pages/live2d') },
      { name: 'currEvent', path: 'currevent/:server(\\S{2})', component: () => import('pages/curr-event') },
      { name: 'stampList', path: 'stamp/:server(\\S{2})', component: () => import('pages/stamp-list') },
      { name: 'titleList', path: 'titles/:server(\\S{2})', component: () => import('pages/title-images') },
      { name: 'about', path: 'about', component: () => import('pages/about') },
      { name: 'testGame', path: 'test/game', component: () => import('components/Game') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
