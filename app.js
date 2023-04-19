const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const resultContainer = document.getElementById("resultContainer");
const audioDiv = document.getElementById("audio");
const imageContainer = document.querySelector('.image-container');


searchButton.addEventListener("click",async function(event) {
  event.preventDefault();
  const searchTerm = searchBox.value;
  const apiKey ='_vLD2__4E8ms7Z3_EkOA9eFwaLujCiRy0XNGhOj6RF0'
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`;
  const apiUrlImage = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=_vLD2__4E8ms7Z3_EkOA9eFwaLujCiRy0XNGhOj6RF0`;
       
  try {
    const response = await  fetch(apiUrlImage);
    const data = await response.json();
    imageContainer.innerHTML = ''; // Clear previous search results
    data.results.forEach((result) => {
      const img = document.createElement('img');
      img.src = result.urls.regular;
      img.alt = result.alt_description;
      imageContainer.appendChild(img);
      console.log(img);
    });
  } catch (error) {
    console.error(error);
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const word = data[0].word;
      const definition = data[0].meanings[0].definitions[0].definition;
      const example = data[0].meanings[0].definitions[0].example;
      const partOfSpeech = data[0].meanings[0].partOfSpeech;
      const aud = `<audio src="${data[0].phonetics[0].audio}" controls>`;

      audioDiv.className = "block";
      audioDiv.innerHTML = aud;

      resultContainer.innerHTML = `
        <h2> ${word}</h2>
        <p>Meaning: ${definition}</p>
        <p>Parts Of Speech: ${partOfSpeech}</p>
        <p><em>Examples: ${example}</em></p>
      `;
      resultContainer.style.display = "block";
    })
    .catch(error => {
      resultContainer.innerHTML = "<p>No results found.</p>";
      resultContainer.style.display = "block";
    });
});
