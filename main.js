// ----------------------------------------
//   Централизованные данные для конвертации
// ----------------------------------------
const conversionData = {
  length: {
    title: "Длина",
    base: "meter",
    units: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      micrometer: 1e6,
      nanometer: 1e9,
      mile: 0.000621371,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701,
      "light-year": 1.057e-16,
    },
  },
  temp: {
    title: "Температура",
    base: "celsius",
    // Нелинейные конверсии требуют отдельных функций
    units: {
      celsius: (value, toUnit) => {
        if (toUnit === "fahrenheit") return (value * 9) / 5 + 32;
        if (toUnit === "kelvin") return value + 273.15;
        return value;
      },
      fahrenheit: (value, toUnit) => {
        if (toUnit === "celsius") return ((value - 32) * 5) / 9;
        if (toUnit === "kelvin") return ((value - 32) * 5) / 9 + 273.15;
        return value;
      },
      kelvin: (value, toUnit) => {
        if (toUnit === "celsius") return value - 273.15;
        if (toUnit === "fahrenheit") return ((value - 273.15) * 9) / 5 + 32;
        return value;
      },
    },
  },
  area: {
    title: "Площадь",
    base: "square-meter",
    units: {
      "square-meter": 1,
      "square-kilometer": 1e-6,
      "square-centimeter": 1e4,
      "square-millimeter": 1e6,
      hectare: 1e-4,
      "square-mile": 3.861e-7,
      "square-foot": 10.7639,
      "square-inch": 1550,
      acre: 0.000247105,
    },
  },
  volume: {
    title: "Объем",
    base: "cubic-meter",
    units: {
      "cubic-meter": 1,
      "cubic-kilometer": 1e-9,
      "cubic-millimeter": 1e9,
      liter: 1000,
      milliliter: 1e6,
      "us-gallon": 264.172,
      "us-quart": 1056.69,
      "us-pint": 2113.38,
      "us-cup": 4226.75,
      "us-fluid-ounce": 33814,
      "us-tables-spoon": 67628,
      "imperial-gallon": 219.969,
      "imperial-quart": 879.877,
      "imperial-pint": 1759.75,
      "imperial-fluid-ounce": 35195.1,
      "imperial-table-spoon": 563121,
      "imperial-tea-spoon": 1689363,
      "cubic-mile": 2.399e-10,
      "cubic-yard": 1.308,
      "cubic-foot": 35.3147,
      "cubic-inch": 61023.7,
    },
  },
  weight: {
    title: "Вес",
    base: "kilogram",
    units: {
      kilogram: 1,
      gram: 1000,
      milligram: 1e6,
      "metric-ton": 0.001,
      "long-ton": 0.000984207,
      "short-ton": 0.00110231,
      pound: 2.20462,
      ounce: 35.274,
      carrat: 5000,
      "automic-mass-unit": 6.022e26,
    },
  },
  time: {
    title: "Время",
    base: "seconds",
    units: {
      seconds: 1,
      milliseconds: 1000,
      microseconds: 1e6,
      nanoseconds: 1e9,
      picoseconds: 1e12,
      minute: 0.0166667,
      hour: 0.000277778,
      day: 1.1574e-5,
      week: 1.6534e-6,
      month: 3.8027e-7,
      year: 3.171e-8,
    },
  },
};

// ----------------------------------------
//   Работа с DOM и обработка событий
// ----------------------------------------

const selectors = document.querySelectorAll(".selector");
const fromSelect = document.getElementById("from-units");
const toSelect = document.getElementById("to-units");
const inputValue = document.getElementById("from-value");
const outputValue = document.getElementById("to-value");
const unitHeader = document.getElementById("unit-header");

let selectedUnitType = "length";

// Функция для динамического создания опций в <select>
const populateSelects = (unitCategory) => {
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  const units = Object.keys(unitCategory.units);
  units.forEach((unit) => {
    const fromOption = document.createElement("option");
    fromOption.value = unit;
    fromOption.textContent = unit.replace(/-/g, " ");

    const toOption = fromOption.cloneNode(true);

    fromSelect.appendChild(fromOption);
    toSelect.appendChild(toOption);
  });

  fromSelect.value = "";
  toSelect.value = "";
};

// Функция для выполнения конвертации
const convertUnits = () => {
  const value = parseFloat(inputValue.value);
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;

  if (isNaN(value) || !fromUnit || !toUnit) {
    outputValue.value = "";
    return;
  }

  const category = conversionData[selectedUnitType];

  // Отдельная логика для температуры
  if (selectedUnitType === "temp") {
    outputValue.value = category.units[fromUnit](value, toUnit).toFixed(4);
    return;
  }

  // Логика для остальных категорий
  const baseValue = value / category.units[fromUnit];
  const finalValue = baseValue * category.units[toUnit];
  outputValue.value = finalValue.toFixed(4);
};

// Обработчик переключения категорий
selectors.forEach((selector) => {
  selector.addEventListener("click", (e) => {
    selectedUnitType = e.target.getAttribute("data-target");
    const unitCategory = conversionData[selectedUnitType];

    unitHeader.textContent = unitCategory.title;
    populateSelects(unitCategory);
    inputValue.value = "";
    outputValue.value = "";
  });
});

// Обработчики ввода и выбора единиц
inputValue.addEventListener("input", convertUnits);
fromSelect.addEventListener("change", convertUnits);
toSelect.addEventListener("change", convertUnits);

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const initialCategory = conversionData[selectedUnitType];
  unitHeader.textContent = initialCategory.title;
  populateSelects(initialCategory);
});
