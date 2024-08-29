document.addEventListener('DOMContentLoaded', function() {
    const agentApiURL = 'https://bymykel.github.io/CSGO-API/api/en/agents.json';
    const weaponApiURL = 'https://bymykel.github.io/CSGO-API/api/en/skins.json';
    const backgroundMusic = './assets/audio.mp3';
    
    // Function to fetch agent data from the API
    function fetchAgentData(agentApiURL) {
        return fetch(agentApiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Function to fetch weapon data from the API
    function fetchWeaponData(weaponApiURL) {
        return fetch(weaponApiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Event listener for the start game button
    document.getElementById('start-game').addEventListener('click', function(event) {
        event.preventDefault(); 
        document.getElementById('start-screen').style.display = 'none'; 
        document.getElementById('team-selection-screen').style.display = 'block'; 
        const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.play().catch(function(error) {
        console.error("Playback failed: ", error);
    });
    });

    // Event listener for team selection buttons
    document.getElementById('terrorist').addEventListener('click', function() {
        proceedToCharacterSelection('Terrorist');
    });
    document.getElementById('counter-terrorist').addEventListener('click', function() {
        proceedToCharacterSelection('Counter-Terrorist');
    });
    document.getElementById('auto-select').addEventListener('click', function() {
        const teams = ['Terrorist', 'Counter-Terrorist'];
        const selectedTeam = teams[Math.floor(Math.random() * teams.length)];
        proceedToCharacterSelection(selectedTeam);
    });

    // Function to proceed to character selection and filter characters
    function proceedToCharacterSelection(team) {
        document.getElementById('team-selection-screen').style.display = 'none';
        document.getElementById('character-selection-screen').style.display = 'block';
        filterCharactersByTeam(team);
    }

    let myCharacterImage = null;
    let myCharacterName = null;

    // Function to filter characters by team and display them
    function filterCharactersByTeam(team) {
        fetchAgentData(agentApiURL)
            .then(data => {
                const container = document.getElementById('character-options');
                container.innerHTML = ''; 
                const chooseContainer = document.getElementById('chooseYourCharacter');
                let count = 0; 
    
                const flexContainer = document.createElement("div");
                flexContainer.classList.add('flex-container'); 
                flexContainer.style.display = 'flex'; 
                flexContainer.style.flexWrap = 'wrap'; 
                flexContainer.style.gap = '90px'; 
    
                container.appendChild(flexContainer);
    
                for (let i = 0; i < data.length; i++) {
                    const obj = data[i];
                    if (obj.team.name === team) {
                        chooseContainer.innerHTML =obj.team.name;
                        const div = document.createElement("div");
                        div.classList.add('character-item'); 
                        div.innerHTML = `
                            <img src="${obj.image}" alt="${obj.name}" style="height: 150px;">
                            <h2 style="color: black;">${obj.name}</h2>
                        `;
                        flexContainer.appendChild(div);
                        count++; 
                        if (count >= data.length) {
                            break; 
                        }
                    }
                }
    
                // Add event listener for selecting characters
                const characterItems = document.querySelectorAll('.character-item');
                characterItems.forEach(item => {
                    item.addEventListener('click', function() {
                        characterItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('selected');
                                otherItem.style.border = 'none'; 
                            }
                        });
    
                        this.classList.toggle('selected');
    
                        if (this.classList.contains('selected')) {
                            myCharacterImage = {
                                image: this.querySelector('img').src
                               
                            };
                            this.style.border = '5px solid red';
                        } else {
                            this.style.border = 'none'; 
                        }
                    });
    
                    item.addEventListener('mouseover', function() {
                        this.style.opacity = '0.5';
                        this.style.cursor = 'pointer';
                    });
    
                    item.addEventListener('mouseout', function() {
                        this.style.opacity = '1';
                    });
                });
    
                // Handle form submission to update selected character's name
                document.getElementById('character-name-form').addEventListener('submit', function(event) {
                    event.preventDefault(); 
    
                    const newName = document.getElementById('character-name').value;
                    const selectedCharacter = document.querySelector('.character-item.selected');
                

                    // Update the name of the selected character
                    if (selectedCharacter) {
                        const nameElement = selectedCharacter.querySelector('h2');
                        if (nameElement) {
                            nameElement.textContent = newName;
                           
                        }
                    }
    
                    // Clear the form input and deselect the character
                    document.getElementById('character-name').value = '';
                    selectedCharacter.classList.remove('selected');
                    selectedCharacter.style.border = 'none'; 
                });
    
            })
    }

    // Event listener for character name form submission
    document.getElementById('character-name-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const characterName = document.getElementById('character-name').value;
        const selectedCharacter = document.querySelector('.character-item.selected');
    if (characterName.split(' ').length <= 2 && characterName.length <= 20 && selectedCharacter) {
        document.getElementById('character-selection-screen').style.display = 'none';
        document.getElementById('weapon-selection-screen').style.display = 'block';
        generateWeaponSelectionScreen();
        myCharacterName = characterName;
    } else {
        alert('Invalid character name or No character Selection.');
    }
    }
);

 // Event listener for weapon selection buttons
 document.getElementById('pistols').addEventListener('click', function() {
    proceedToWeaponSelection("Pistols");

});
document.getElementById('heavy').addEventListener('click', function() {
    proceedToWeaponSelection("Heavy");
});
document.getElementById('smgs').addEventListener('click', function() {
    proceedToWeaponSelection("SMGs");
});
document.getElementById('rifles').addEventListener('click', function() {
    proceedToWeaponSelection("Rifles");
});
document.getElementById('knives').addEventListener('click', function() {
    proceedToWeaponSelection("Knives");
});
document.getElementById('gloves').addEventListener('click', function() {
    proceedToWeaponSelection("Gloves");
});

function proceedToWeaponSelection(weapon) {
    document.getElementById('team-selection-screen').style.display = 'none';
    document.getElementById('character-selection-screen').style.display = 'none';
    filterWeaponsByName(weapon);
    
}



//function to get the random multiple of 50 for gun price
function getRandomPrice(min, max) {
    min = Math.ceil(min / 50); 
    max = Math.floor(max / 50);
    return Math.floor(Math.random() * (max - min + 1)) * 50 + min * 50; 
}

//To store maxbalance and selected weapons
const maxCost = 9000;
  let selectedWeapons = {
    pistols: null,
    smgs: null,
    rifles: null,
    heavy: null,
    knives: null,
    gloves: null
};

//Screen 4 filter guns 
function filterWeaponsByName(weapon) {
    fetchWeaponData(weaponApiURL)
        .then(weapondata => {
         balance = document.getElementById('actualBalance');
            const weaponContainer = document.getElementById('listed-weapons');
            weaponContainer.innerHTML = ''; 

            let count = 0; 

            const flexWeaponContainer = document.createElement("div");
            flexWeaponContainer.classList.add('flex-container'); 
            flexWeaponContainer.style.overflowY = 'auto'; 
            flexWeaponContainer.style.display = 'flex'; 
            flexWeaponContainer.style.flexWrap = 'wrap'; 
            flexWeaponContainer.style.justifyContent = 'space-between'; 
            weaponContainer.appendChild(flexWeaponContainer);

            for (let i = 0; i < weapondata.length; i++) {
                const object = weapondata[i];
                //assigning price as category
                if (object.category.name == weapon) {
                    if (object.category.name.toLowerCase() === 'pistols') {
                        object.price = getRandomPrice(200, 700);
                    } else if (object.category.name.toLowerCase() === 'smgs') {
                        object.price = getRandomPrice(1000, 1500);
                    } else if (object.category.name.toLowerCase() === 'rifles') {
                        object.price = getRandomPrice(1500, 3500);
                    } else if (object.category.name.toLowerCase() === 'heavy') {
                        object.price = getRandomPrice(2500, 4500);
                    } else if (object.category.name.toLowerCase() === 'knives' || object.category.name.toLowerCase() === 'gloves') {
                        object.price = getRandomPrice(100, 500);
                    } else {
                        object.price = 0;
                    }

                    const weapondiv = document.createElement("div");
                    weapondiv.innerHTML = '';

                    weapondiv.style.marginLeft = '20px'; 
                    weapondiv.style.marginTop = '20px';
                    weapondiv.style.width = '48%'; 
                    weapondiv.style.boxSizing = 'border-box'; 
                    weapondiv.style.overflowY = 'auto'; 
                    weapondiv.classList.add('gun-item'); 
                    weapondiv.innerHTML = `
                         <img src="${object.image}" alt="${object.name}" style="height: 70px;">
                        <h2 style="color: black;">${object.name}</h2>
                        <p style="color: black;">$ ${object.price}</p>
                    `;

                    // Add hover effect
                    weapondiv.addEventListener('mouseenter', () => {
                        weapondiv.style.backgroundColor = '#f0f0f0'; 
                    });

                    weapondiv.addEventListener('mouseleave', () => {
                        weapondiv.style.backgroundColor = 'transparent'; 
                    });

                    // Add click event to selected weapon
                    weapondiv.addEventListener('click', () => {
                        if (selectedWeapons[object.category.name.toLowerCase()]) {
                            selectedWeapons[object.category.name.toLowerCase()].style.border = '2px solid #4e4949';
                            const previousSelectedGun = selectedWeapons[object.category.name.toLowerCase()];
                            const previousPrice = previousSelectedGun.dataset.price;
                            balance.innerHTML = parseInt(balance.innerHTML) + parseInt(previousPrice);
                        }
                        weapondiv.dataset.price = object.price;
                    
                        actualBalance = parseInt(balance.innerHTML);
                        if (object.price <= actualBalance) {
                            balance.innerHTML = actualBalance - object.price;
                        } else {
                            return alert("Cannot perform transaction. Insufficient Balance.");
                        }
                        selectedWeapons[object.category.name.toLowerCase()] = weapondiv;
                        weapondiv.classList.add('selected');
                        weapondiv.style.border = '5px solid red';
                    });
                    
                    flexWeaponContainer.appendChild(weapondiv);
                    count++;

                    if (count >= weapondata.length) {
                        break; 
                    }
                } 
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

//just passed actualBalance from here
async function generateWeaponSelectionScreen() {
    let balance = document.getElementById('actualBalance');
    balance.innerHTML = maxCost;
}

//Proceed to overview button of screen 4 checking here
const checkWeaponsButton = document.getElementById('proceedToOverview');

function checkSelectedWeapons() {
    for (const weapon in selectedWeapons) {
        if (selectedWeapons[weapon] === null) {
            alert("Please select all of your weapons.");
            return; 
        }
    }
    showMyCharacterScreen();
}

checkWeaponsButton.addEventListener('click', function() {
    checkSelectedWeapons();
});


//Screen 5 character overview

function showMyCharacterScreen(){
    document.getElementById('weapon-selection-screen').style.display = 'none';
    characterScreen = document.getElementById('character-overview-screen').style.display = 'block';
    myCharacterImageOverview = document.getElementById('chracterPhoto');
    myCharacterImageOverview.src = `${myCharacterImage.image}`;
    myCharacterNameOverview = document.getElementById('myCharacterName');
    myCharacterNameOverview.innerHTML = `${myCharacterName}`;
    pistolsPictureOverview = document.getElementById('pistolsImage');
    pistolsPictureOverview.src = selectedWeapons.pistols.querySelector("img").src;
    knivesPictureOverview = document.getElementById('knivesImage');
    knivesPictureOverview.src = selectedWeapons.knives.querySelector("img").src;
    glovesPictureOverview = document.getElementById('glovesImage');
    glovesPictureOverview.src = selectedWeapons.gloves.querySelector("img").src;
    smgsPictureOverview = document.getElementById('smgImage');
    smgsPictureOverview.src = selectedWeapons.smgs.querySelector("img").src;
    riflesPictureOverview = document.getElementById('riflesImage');
    riflesPictureOverview.src = selectedWeapons.rifles.querySelector("img").src;
    heavyPictureOverview = document.getElementById('heavyImage');
    heavyPictureOverview.src = selectedWeapons.heavy.querySelector("img").src;
    var hoverKnivesText = document.getElementById('hoverKnivesText');
    hoverKnivesText.innerHTML = selectedWeapons.knives.querySelector("h2").textContent;
    var hoverPistolsText = document.getElementById('hoverPistolsText');
    hoverPistolsText.innerHTML = selectedWeapons.pistols.querySelector("h2").textContent;
    var hoverGlovesText = document.getElementById('hoverGlovesText');
    hoverGlovesText.innerHTML = selectedWeapons.gloves.querySelector("h2").textContent;
    var hoverSmgsText = document.getElementById('hoverSmgsText');
    hoverSmgsText.innerHTML = selectedWeapons.smgs.querySelector("h2").textContent;
    var hoverRiflesText = document.getElementById('hoverRiflesText');
    hoverRiflesText.innerHTML = selectedWeapons.rifles.querySelector("h2").textContent;
    var hoverHeavyText = document.getElementById('hoverHeavyText');
    hoverHeavyText.innerHTML = selectedWeapons.heavy.querySelector("h2").textContent;
}

//team name form validation
let teamNam;
    document.getElementById('team-name-form').addEventListener('submit', function(event) {
        event.preventDefault();
    var teamName = document.getElementById('team-name').value.trim(); 
    teamNam = teamName;
    var regex = /^[a-zA-Z]+$/;
    if (!regex.test(teamName)) {
        alert('Team name must be a single word of alphabetical characters (symbols/numbers are not allowed).');
    } else if (teamName.includes(' ')) {
        alert('Team name must be a single word.');
    } else {
        showTeamScreen();
        
    }
});

//assgining image for random characters
async function fetchRandomPlayers() {
    try {
      const response = await fetch(agentApiURL);
      const data = await response.json();
      const randomPlayers = [];
      const totalObjects = data.length;
  
      while (randomPlayers.length < 3) {
        const randomIndex = Math.floor(Math.random() * totalObjects);
        if (!randomPlayers.includes(randomIndex)) {
          randomPlayers.push(randomIndex);
        }
      }
  
      randomObjects = randomPlayers.map(index => data[index]); 
     
      char2 = randomObjects[0].image;
      char3 = randomObjects[1].image;
      char4 = randomObjects[2].image;
    } catch (error) {
      console.error('Error fetching random objects:', error);
    }
  }
  
  fetchRandomPlayers();

  //the function to fetch random names
  let randomNames = [];

  async function fetchRandomNames() {
      try {
          for (let i = 0; i < 4; i++) {
              const response = await fetch('https://randomuser.me/api/');
              const data = await response.json();
              const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
              char2Name = randomNames[0];
              char3Name = randomNames[1];
              char4Name = randomNames[2];
              randomNames.push(name);
          }
      } catch (error) {
          console.error("Failed to fetch random user data:", error);
      }
  }
  

fetchRandomNames();
  
//assigning values for guns
  const PriceMap = {
      "SMGs": getRandomPrice(1000, 1500),
      "Pistols": getRandomPrice(200, 700),
      "Heavy": getRandomPrice(3500, 4500),
      "Rifles": getRandomPrice(1500, 3500),
      "Knives": getRandomPrice(100, 500),
      "Gloves": getRandomPrice(100, 500),
  };
  
  //allweapondata fetch testing
  let allWeaponData = {}; 
  
  async function fetchDataAndStore(weaponApiURL) {
    try {
      const response = await fetch(weaponApiURL);
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }

      allWeaponData = data;
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
fetchDataAndStore(weaponApiURL);
  
//variables to store char name and image 
let randomObjects = [];
let char2Name;
let char3Name;
let char4Name;
let char2;
let char3;
let char4; 

//constructor
class Character {
    constructor() {
        this.skin = [];
    }
}


//Screen 6
function showTeamScreen(){
    document.getElementById('character-overview-screen').style.display = 'none';
    document.getElementById('team-overview-screen').style.display = 'block';
    myCharacter1ImageOverview = document.getElementById('char1');
    myCharacter1ImageOverview.src = `${myCharacterImage.image}`;
    myCharacter1NameOverview = document.getElementById('char1Name');
    myCharacter1NameOverview.innerHTML = `${myCharacterName}`;

    pistols1PictureOverview = document.getElementById('pistols1');
    pistols1PictureOverview.src = selectedWeapons.pistols.querySelector("img").src;
    knives1PictureOverview = document.getElementById('knives1');
    knives1PictureOverview.src = selectedWeapons.knives.querySelector("img").src;
    gloves1PictureOverview = document.getElementById('gloves1');
    gloves1PictureOverview.src = selectedWeapons.gloves.querySelector("img").src;
    smgs1PictureOverview = document.getElementById('smgs1');
    smgs1PictureOverview.src = selectedWeapons.smgs.querySelector("img").src;
    rifles1PictureOverview = document.getElementById('rifles1');
    rifles1PictureOverview.src = selectedWeapons.rifles.querySelector("img").src;
    heavy1PictureOverview = document.getElementById('heavy1');
    heavy1PictureOverview.src = selectedWeapons.heavy.querySelector("img").src;
    var hoverKnivesText = document.getElementById('knives1Hover');
    hoverKnivesText.innerHTML = selectedWeapons.knives.querySelector("h2").textContent;
    var hoverKnivesText = document.getElementById('pistols1Hover');
    hoverKnivesText.innerHTML = selectedWeapons.knives.querySelector("h2").textContent;
    var hoverGlovesText = document.getElementById('gloves1Hover');
    hoverGlovesText.innerHTML = selectedWeapons.gloves.querySelector("h2").textContent;
    var hoverSmgsText = document.getElementById('smgs1Hover');
    hoverSmgsText.innerHTML = selectedWeapons.smgs.querySelector("h2").textContent;
    var hoverRiflesText = document.getElementById('rifles1Hover');
    hoverRiflesText.innerHTML = selectedWeapons.rifles.querySelector("h2").textContent;
    var hoverHeavyText = document.getElementById('Heavy1Hover');
    hoverHeavyText.innerHTML = selectedWeapons.heavy.querySelector("h2").textContent;

    myCharacter2ImageOverview = document.getElementById('char2');
    myCharacter2ImageOverview.src = `${char2}`;
    myCharacter2NameOverview = document.getElementById('char2Name');
    myCharacter2NameOverview.innerHTML = `${char2Name}`;

    myCharacter3ImageOverview = document.getElementById('char3');
    myCharacter3ImageOverview.src = `${char3}`;
    myCharacter3NameOverview = document.getElementById('char3Name');
    myCharacter3NameOverview.innerHTML = `${char3Name}`;

    myCharacter4ImageOverview = document.getElementById('char4');
    myCharacter4ImageOverview.src = `${char4}`;
    myCharacter4NameOverview = document.getElementById('char4Name');
    myCharacter4NameOverview.innerHTML = `${char4Name}`;

    //calling characters and passing budgets
    let characters = [];
    characters[0] = GetCharacter(9000);
    characters[1] = GetCharacter(9000);
    characters[2] = GetCharacter(9000);
    
    pistols2PictureOverview = document.getElementById('pistols2');
    pistols2PictureOverview.src = characters[0].skin[0].image;
    knives2PictureOverview = document.getElementById('knives2');
    knives2PictureOverview.src =characters[0].skin[1].image;
    gloves2PictureOverview = document.getElementById('gloves2');
    gloves2PictureOverview.src = characters[0].skin[2].image;
    smgs2PictureOverview = document.getElementById('smgs2');
    smgs2PictureOverview.src = characters[0].skin[3].image;
    rifles2PictureOverview = document.getElementById('rifles2');
    rifles2PictureOverview.src = characters[0].skin[4].image;
    heavy2PictureOverview = document.getElementById('heavy2');
    heavy2PictureOverview.src = characters[0].skin[5].image;
    var hoverKnivesText2 = document.getElementById('knives2Hover');
    hoverKnivesText2.innerHTML = characters[0].skin[0].name;
    var hoverKnivesText2 = document.getElementById('pistols2Hover');
    hoverKnivesText2.innerHTML = characters[0].skin[1].name;
    var hoverGlovesText2 = document.getElementById('gloves2Hover');
    hoverGlovesText2.innerHTML = characters[0].skin[2].name;
    var hoverSmgsText2 = document.getElementById('smgs2Hover');
    hoverSmgsText2.innerHTML = characters[0].skin[3].name;
    var hoverRiflesText2 = document.getElementById('rifles2Hover');
    hoverRiflesText2.innerHTML = characters[0].skin[4].name;
    var hoverHeavyText2 = document.getElementById('Heavy2Hover');
    hoverHeavyText2.innerHTML = characters[0].skin[5].name;


    pistols3PictureOverview = document.getElementById('pistols3');
    pistols3PictureOverview.src = characters[1].skin[0].image;
    knives3PictureOverview = document.getElementById('knives3');
    knives3PictureOverview.src =characters[1].skin[1].image;
    gloves3PictureOverview = document.getElementById('gloves3');
    gloves3PictureOverview.src = characters[1].skin[2].image;
    smgs3PictureOverview = document.getElementById('smgs3');
    smgs3PictureOverview.src = characters[1].skin[3].image;
    rifles3PictureOverview = document.getElementById('rifles3');
    rifles3PictureOverview.src = characters[1].skin[4].image;
    heavy3PictureOverview = document.getElementById('heavy3');
    heavy3PictureOverview.src = characters[1].skin[5].image;
    var hoverKnivesText3 = document.getElementById('knives3Hover');
    hoverKnivesText3.innerHTML = characters[1].skin[0].name;
    var hoverKnivesText3 = document.getElementById('pistols3Hover');
    hoverKnivesText3.innerHTML = characters[1].skin[1].name;
    var hoverGlovesText3 = document.getElementById('gloves3Hover');
    hoverGlovesText3.innerHTML = characters[1].skin[2].name;
    var hoverSmgsText3 = document.getElementById('smgs3Hover');
    hoverSmgsText3.innerHTML = characters[1].skin[3].name;
    var hoverRiflesText3 = document.getElementById('rifles3Hover');
    hoverRiflesText3.innerHTML = characters[1].skin[4].name;
    var hoverHeavyText3 = document.getElementById('Heavy3Hover');
    hoverHeavyText3.innerHTML = characters[1].skin[5].name;


    pistols4PictureOverview = document.getElementById('pistols4');
    pistols4PictureOverview.src = characters[2].skin[0].image;
    knives4PictureOverview = document.getElementById('knives4');
    knives4PictureOverview.src =characters[2].skin[1].image;
    gloves4PictureOverview = document.getElementById('gloves4');
    gloves4PictureOverview.src = characters[2].skin[2].image;
    smgs4PictureOverview = document.getElementById('smgs4');
    smgs4PictureOverview.src = characters[2].skin[3].image;
    rifles4PictureOverview = document.getElementById('rifles4');
    rifles4PictureOverview.src = characters[2].skin[4].image;
    heavy4PictureOverview = document.getElementById('heavy4');
    heavy4PictureOverview.src = characters[2].skin[5].image;

    var hoverKnivesText4 = document.getElementById('knives4Hover');
    hoverKnivesText4.innerHTML = characters[2].skin[0].name;
    var hoverKnivesText4 = document.getElementById('pistols4Hover');
    hoverKnivesText4.innerHTML = characters[2].skin[1].name;
    var hoverGlovesText4 = document.getElementById('gloves4Hover');
    hoverGlovesText4.innerHTML = characters[2].skin[2].name;
    var hoverSmgsText4 = document.getElementById('smgs4Hover');
    hoverSmgsText4.innerHTML = characters[2].skin[3].name;
    var hoverRiflesText4 = document.getElementById('rifles4Hover');
    hoverRiflesText4.innerHTML = characters[2].skin[4].name;
    var hoverHeavyText4 = document.getElementById('Heavy4Hover');
    hoverHeavyText4.innerHTML = characters[2].skin[5].name;


    teamAddName = document.getElementById('team');
    teamAddName.innerHTML += teamNam;

}

//Generate random characters 
function GetCharacter(budget) {
    let character = new Character();
    let totalSelectedPrice = 0;

    const isPickUp = {
        "SMGs": false,
        "Pistols": false,
        "Heavy": false,
        "Rifles": false,
        "Knives": false,
        "Gloves": false,
    };

    let i = 0;
    while (i < allWeaponData.length) {
        let num = Math.floor(Math.random() * allWeaponData.length);
        let skin = allWeaponData[num].category.name;

        if (isPickUp.hasOwnProperty(skin) && isPickUp[skin] === false && PriceMap[skin] <= (budget/2)) {
            let skinPrice = PriceMap[skin];
                isPickUp[skin] = true;
                character.skin.push(allWeaponData[num]);
                totalSelectedPrice += skinPrice;
            
        }
        i++;
    }
    return character;
}

window.onbeforeunload = function() {
    document.getElementById('bgAudio').pause();
};



});


