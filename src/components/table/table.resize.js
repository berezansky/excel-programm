// Функция изменения размера ячеек для Table

import {$} from '@core/dom';

export function resizeHandler($root, event) {
  return new Promise(resolve => {
    const $resizer = $(event.target)
    const $parent = $resizer.closest('[data-type="resizable"]')
    const coords = $parent.getCoords()
    const type = $resizer.data.resize
    const sideProp = type === 'col' ? 'bottom' : 'right'
    let value = null
    $resizer.css({
      'opacity': 1,
      [sideProp]: '-5000px'
    })
    document.onmousemove = evt => {
      if (type === 'col') {
        const delta = evt.pageX - coords.right
        value = coords.width + delta
        $resizer.css({'right': -delta + 'px'})
      } else {
        const delta = evt.pageY - coords.bottom
        value = coords.height + delta
        $resizer.css({'bottom': -delta + 'px'})
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      if (type === 'col') {
        $parent.css({'width': value + 'px'})
        $root
            .findAll(`[data-col="${$parent.data.col}"]`)
            .forEach(el => el.style.width = value + 'px')
      } else {
        $parent.css({'height': value + 'px'})
      }

      resolve({
        value,
        type,
        id: $parent.data[type]
      })

      $resizer.css({
        'opacity': 0,
        'right': 0,
        'bottom': 0
      })
    }
  })
}