if (document.querySelector("#map")) {
  ymaps.ready(init);

  function init() {
    var myMap = new ymaps.Map(
        "map",
        {
          center: [59.860982, 30.290149],
          zoom: 12,
        },
        {
          searchControlProvider: "yandex#search",
        }
      ),
      myPlacemark = new ymaps.Placemark([59.860982, 30.290149], {
        balloonContentHeader: "Выезд на замер по городу СПб и области!",
        balloonContentBody: "+7 (812) 607-16-42",
        balloonContentFooter: "ежедневно с 9 до 21",
        hintContent: "ул. Краснопутиловская, д. 69 лит.",
      });

    myMap.geoObjects.add(myPlacemark);
  }
}
