async function scrapTestCard(child) {
  const title = child.querySelector(".title > .title-wrap").innerText;
  const type = child.querySelector(".info > ui-icon-label:nth-child(1)").innerText;
  const durationContainer = child.querySelector("div.info > ui-icon-label:nth-child(2)");
  let duration = "0";
  if(durationContainer) {
    duration = durationContainer.querySelector("span").innerText.split(" ")[0] * 60;
  }
  let description = '';
  const showMoreBtn = child.querySelector(".footer > .show-more-btn > a");
  let relevancy = "";
  let whatLookFor = "";
  if (showMoreBtn) {
    showMoreBtn.click();
    // sleep for 1 second to wait for the description to load
    await new Promise((resolve) => setTimeout(resolve, 1000));
    description = child.querySelector("div.expandable-content > div > tgo-quill-view > quill-view > div > div > p").innerText;
    const info = child.querySelector("div.expandable-content > .show-more");
    console.log(title);
    relevancy = info.querySelector(".left > p").innerText;
    whatLookFor = info.querySelector(".right > p").innerText;
    showMoreBtn.click();
  }
  return { title, attributes: {
    content: description,
    relevancy,
    look_for: whatLookFor,
    category: "Motivation",
    duration_seconds: duration,
    type,
    language: "english",
    position: 1
  } };
}

async function downloadDataAsJson(filename) {
  let container = document.querySelector("#container-3 > layout-content > tgo-assessment-form > div > div > div.stepper-wrapper.ng-tns-c2356563674-4 > div.mt-32.ng-tns-c2356563674-4 > tgo-assessment-form-step3 > app-custom-questions-table > div:nth-child(2) > div:nth-child(3) > app-custom-question-search > div > div > main")

  let customQuestionBoxs = container.querySelectorAll("app-custom-question-result-box > ui-card > div.card-container > div.preview"); 
  let data = Array.from(customQuestionBoxs).map(async (child) => await scrapTestCard(child));
  data = await Promise.all(data);
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

await downloadDataAsJson("custom_questions.json");