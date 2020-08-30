import db from '../../db'

const banddb = db.band

export const SET_BAND_LIST = (state, { data, server }) => {
  state.bandList[server] = data
  state.bandMap[server] = data.reduce((obj, item) => {
    obj[item.bandId] = item
    return obj
  }, {})

  data.forEach(band => {
    banddb.get({ bandId: band.bandId, server }).then(_band => {
      if (!_band) banddb.put(Object.assign({}, band, { server }))
    })
  })
}
