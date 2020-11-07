import { DomListener } from '@core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.emitter = options.emitter
    this.subscribe = options.subscribe || []
    this.store = options.store
    this.unsubscribers = []

    this.prepare()
  }

  // Настраивает компонент до init
  prepare() {}

  toHTML() {
    return ''
  }

  $emit(event, ...args) {
    this.emitter.emit(event, ...args)
  }

  // Подписываемся на события
  $on(event, fn) {
    const unsubscribe = this.emitter.subscribe(event, fn)
    // Добавляем все события в массив (эти события уже созданны в виде переменных, а значит у них есть возвращенный метод, удаляющий события)
    this.unsubscribers.push(unsubscribe)
  }

  // Диспатч событий в стор
  $dispatch(action) {
    this.store.dispatch(action)
  }

  // Сюда приходят только изменения по тем полям на которые мы подписались
  storeChanged() {}

  isWatching(key) {
    return this.subscribe.includes(key)
  }

  // Автоматические отписки от событий

  // Инициализирует компонент
  // Добавляет DOM слушателей
  init() {
    this.initDOMListeners()
  }

  // Удаление компонента, чистка слушателей
  destroy() {
    this.removeDOMListeners()
    // Перебираем массив методов, и удаляем все события
    this.unsubscribers.forEach(unsubscribe => unsubscribe())
  }
}