// this script will download all the test data from the test page of the website
// and save it as a json file

async function scrollToBottomUntilEnd() {
  return new Promise((resolve, reject) => {
    let distance = 100;
    let lastHeight = document.body.scrollHeight;

    let scrollInterval = setInterval(() => {
      window.scrollBy(0, distance);
      let newHeight = document.body.scrollHeight;

      if (newHeight !== lastHeight) {
        lastHeight = newHeight; 
      } else {
        clearInterval(scrollInterval);

        let loadMoreButton = document.querySelector('.load-more-button'); // Example selector for a "load more" button
        if (loadMoreButton) {
          loadMoreButton.click();
        } else {
          resolve(); 
        }
      }
    }, 1000); 
  });
}

function scrapTestCard(child) {
  const title = child.querySelector("h3").innerText;
  const description = child.querySelector(".test-card__description-content").innerText;
  const duration = child.querySelector("ui-card > div > div > div.test-card__content > div.test-card__features.ng-star-inserted > div:nth-child(1) > span").innerText;
  const select_questions = child.querySelector("ui-card > div > div > div.test-card__content > div.test-card__features.ng-star-inserted > div:nth-child(2) > span").innerText;
  const type = child.querySelector("ui-card > div > div > div.test-card__content > div.test-card__features.ng-star-inserted > div.test-card__feature-item.ng-star-inserted > span").innerText;
  return { title, description, duration, select_questions, type };
}

async function downloadDataAsJson(filename) {
  await scrollToBottomUntilEnd();
  let parentElement = document.querySelector("#container-3 > layout-content > app-test-list > div > div > div.search-tests > div.results-section > div.search-results.search-results--redesigned");
  let childElements = parentElement.children;

  let data = Array.from(childElements).map((child) => scrapTestCard(child));
  console.log(data);


  let jsonData = JSON.stringify(data, null, 2);

  let blob = new Blob([jsonData], { type: 'application/json' });

  let link = document.createElement('a');

  link.download = filename;

  link.href = URL.createObjectURL(blob);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  console.log(`Data has been written to ${filename}`);
}

const categories = [
  { name: "Cognitive ability", count: 14 },
  { name: "Language", count: 35 },
  { name: "Personality & culture", count: 6 },
  { name: "Programming skills", count: 55 },
  { name: "Role-specific skills", count: 66 },
  { name: "Situational judgment", count: 9 },
  { name: "Software skills", count: 38 },
  { name: "Typing speed", count: 0 }
];
const categoriesContainer = document.querySelector("#cdk-accordion-child-4 > div > div > div > ul")
async function downloadAllCategory(index, category) {
  let categoryElement = categoriesContainer.querySelector(`li:nth-child(${index + 1}) > ui-checkbox > div > mat-checkbox > div > div > input`);
  if (categoryElement) {
    console.log(`Expanding category ${category.name}`);
    categoryElement.click();
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    await downloadDataAsJson(`${category.name.replace(/ /g, '_').toLowerCase()}-fr.json`)
    console.log(`Downloading data for ${category.name}`);
    categoryElement.click();
  } else {
    console.error(`Category element not found for index ${index}`);
  }
}

for (let i = 0; i < categories.length; i++) {
  await downloadAllCategory(i, categories[i]);
}
