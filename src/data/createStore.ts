import localForage from "localforage"

export interface KeyedItem {
  id: string
}

export function generateStore<T extends KeyedItem> (name: string) {
  const store = localForage.createInstance({
    name: `llama-dungeon__${name}Store`,
    version: 1.0
  })

  const create = async (data: T) => {
    try {
      return store.setItem(data.id, data)
    } catch (error) {
      console.error(`Unable to create ${name}: `, error, data)
    }
  }

  const get = async (id: string) => {
    try {
      return store.getItem<T>(id)
    } catch (error) {
      console.error(`Unable to get ${name}: `, error, id)
    }
  }

  const update = async (data: Partial<T>) => {
    if (!data.id) {
      console.error(`Unable to update a ${name} with an undefined id: `, data)
      return
    }

    const currentData = await get(data.id)
    if (!currentData) {
      console.error(`Unable to update a ${name} that does not exist, call create instead: `, data)
      return
    }
    const updatedData = {
      ...currentData,
      ...data
    }

    try {
      return store.setItem(updatedData.id, updatedData)
    } catch (error) {
      console.error(`Unable to update ${name}: `, error, updatedData)
    }
  }

  const remove = async (id: string) => {
    try {
      await store.removeItem(id)
      return true
    } catch (error) {
      console.error(`Unable to remove ${name}: `, error, id)
      return false
    }
  }

  return {
    store,
    create,
    get,
    update,
    remove
  }
}