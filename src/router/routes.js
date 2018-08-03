
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: 'card/overview/:server(\\S{2})', component: () => import('pages/card-list') },
      { path: 'card/:server(\\S{2})/:cardId(\\d+)/:isTrained(\\d{1})', component: () => import('pages/card-detail') },
      { path: 'scenario/:server(\\S{2})/:scenarioType/:scenarioName', component: () => import('pages/scenario') },
      { path: 'sfcs/:server(\\S{2})', component: () => import('pages/single-frame-cartoon') },
      { path: 'music/:server(\\S{2})', component: () => import('pages/music-list') },
      { path: 'music/:server(\\S{2})/:musicId(\\d+)', component: () => import('pages/music-detail') },
      { path: 'music/:server(\\S{2})/:musicId(\\d+)/beatmap', component: () => import('pages/music-beatmap') },
      { path: 'l2d/:server(\\S{2})', component: () => import('pages/live2d') },
      { path: 'currevent/:server(\\S{2})', component: () => import('pages/curr-event') },
      { path: 'stamp/:server(\\S{2})', component: () => import('pages/stamp-list') },
      { path: 'about', component: () => import('pages/about') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
