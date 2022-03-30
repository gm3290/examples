import { keyBy, keys } from "lodash"

export const getFilterOtps = (items) => {
  const keyedItems = keyBy(items, "classCurrent")
  return ["All"].concat(keys(keyedItems).filter((x) => x && x !== "null"))
}

export const sortOpts = [
  {
    key: "name",
    value: "name",
    direction: "asc",
  },
  {
    key: "xp",
    value: "experiencePoints",
    direction: "asc",
  },
  {
    key: "rating",
    value: "carRating",
    direction: "asc",
  },
  {
    key: "model",
    value: "modelFactory",
    direction: "asc",
  },
]

export const getOrderedList = (filter, sort, assets) => {
  let newArr = []
  if (!assets) return newArr

  if (filter === "All") {
    newArr = [...assets]
  } else {
    newArr = assets.filter((car) => car.classCurrent === filter)
  }

  if (sort) {
    const { value, direction = "asc" } = sort
    if (direction === "asc") {
      newArr = newArr.sort((a, b) => {
        if (a[value] < b[value]) {
          return -1
        }
        if (a[value] > b[value]) {
          return 1
        }
        return 0
      })
    } else {
      newArr = newArr.sort((a, b) => {
        if (a[value] > b[value]) {
          return -1
        }
        if (a[value] < b[value]) {
          return 1
        }
        return 0
      })
    }
  }

  return newArr
}
