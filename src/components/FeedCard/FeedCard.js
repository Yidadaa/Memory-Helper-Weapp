Component({
  behaviors: [require('../../behaviors/FlyPage')],

  properties: {
    date: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    folder: {
      type: String,
      value: ''
    },
    status: {
      type: String,
      value: ''
    },
    times: {
      type: Number,
      value: 0
    }
  },

  data: {
    flySelector: '.feed-card'
  },

  methods: {
    onCardChange () {
      if (this.data.shouldFly) {
        this.closeIt()
      } else {
        this.flyIt('.feed-card')
      }
    },

    onCardTouch () {
      if (this.data.shouldFly) this.closeIt()
    }
  }
})