import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useGenericStore = defineStore('generic', () => {
  // let canvas = "";
  // let thumbnailWidth = ref(0);
  // let thumbnailHeight = ref(0);

  // let photoFile = ref("");
  // let photoScale = ref(0.0);
  // let photoLeft = ref(0.0);
  // let photoTop = ref(0.0);

  // runner, title, subtitle, category, money. + initial values????
  // some kind of map of elements?
  // generate inputs based on map
  // provide expected keys in View, hardcode in redraw
  // map[string]{}
  //
  const runner = ref('')
  const title = ref('')
  const subtitle = ref('')
  const category = ref('')
  const money = ref(0)
  const time = ref('')

  return { runner, title, subtitle, category, money, time }
})
