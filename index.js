const rootEl = document.getElementById('root');

// Create Name Input
const nameContainer = document.createElement('div');
nameContainer.classList.add('input-container');
const nameLabel = document.createElement('label');
nameLabel.for = 'name-input';
nameLabel.innerText = 'Name';
nameLabel.classList.add('input-label');
const nameInput = document.createElement('input');
nameInput.id = 'name-input';
nameInput.classList.add('form-input');
nameContainer.appendChild(nameLabel);
nameContainer.appendChild(nameInput);

// Create Age Input
const ageContainer = document.createElement('div');
ageContainer.classList.add('input-container');
const ageLabel = document.createElement('label');
ageLabel.for = 'age-input';
ageLabel.innerText = 'Age';
ageLabel.classList.add('input-label');
const ageInput = document.createElement('input');
ageInput.classList.add('form-input');
ageInput.id = 'age-input';
ageContainer.appendChild(ageLabel);
ageContainer.appendChild(ageInput);

// Error Text
const errorText = document.createElement('span');
errorText.classList.add('error-text');
errorText.innerText = 'Age must be a number';

// Create Submission
const submit = document.createElement('button');
submit.classList.add('form-button');
submit.innerText = 'Add Member';
const container = document.createElement('div');
container.classList.add('form-container');

// Family Container
const familyContainer = document.createElement('div');
familyContainer.classList.add('family-container');

// State of Application
const state = {
  age: '',
  name: '',
  selectedMember: null,
  root: null,
};

// Create an Avatar Element
const createMember = member => {
  const avatarContainer = document.createElement('div');
  avatarContainer.classList.add('avatar-container');

  const avatarImageContainer = document.createElement('div');
  avatarImageContainer.classList.add('avatar');
  avatarImageContainer.onclick = () => {
    if (state.selectedMember === state.root && state.root.node === avatarContainer) {
      console.log('Cannot unselect root');
    } else if (state.selectedMember !== member) {
      avatarImageContainer.classList.toggle('selected');
      state.selectedMember.node.children[0].classList.toggle('selected');
      state.selectedMember = member;
    } else {
      avatarImageContainer.classList.toggle('selected');
      state.selectedMember = state.root;
      state.selectedMember.node.children[0].classList.toggle('selected');
    }
  };

  const avatarImage = document.createElement('img');
  avatarImage.classList.add('avatar-img');
  fetch('http://faker.hook.io/?property=image.avatar')
    .then(res => res.json())
    .then(jsonRes => {
      avatarImage.src = jsonRes;
    })
    .catch(e => console.error(e));

  avatarImageContainer.appendChild(avatarImage);

  const avatarName = document.createElement('span');
  avatarName.classList.add('avatar-name');
  avatarName.innerText = member.name;

  const avatarAge = document.createElement('span');
  avatarAge.classList.add('avatar-age');
  avatarAge.innerText = `${member.age} yrs`;

  avatarContainer.appendChild(avatarImageContainer);
  avatarContainer.appendChild(avatarName);
  avatarContainer.appendChild(avatarAge);

  return avatarContainer;
};

// Create Row for Avatars
const createRow = genNum => {
  const row = document.createElement('div');
  row.classList.add('generation-container');

  const title = document.createElement('span');
  title.classList.add('generation-title');
  title.innerText = `Generation ${genNum + 1}`;

  const avatarRow = document.createElement('div');
  avatarRow.classList.add('generation-row');

  row.appendChild(title);
  row.appendChild(avatarRow);

  return row;
};

// Family Tree
class FamilyTree {
  constructor(name, age, generation = 0) {
    if (typeof name !== 'string') {
      throw new Error('Peoples names are strings silly.');
    }

    this.name = name;
    this.age = age;
    this.generation = generation;
    this.node = null;
    this.children = [];
  }

  insert(name, age) {
    const newMember = new FamilyTree(name, age, this.generation + 1);
    this.children.push(newMember);

    return newMember;
  }

  setNode(node) {
    this.node = node;
  }

  familySize() {
    return 1 + this.children.length;
  }

  findMember(name) {
    if (this.name === name) {
      return this;
    }

    return this.children.find(child => {
      return child.findMember(name);
    });
  }

  renderTree() {
    if (!this.node) {
      this.setNode(createMember(this));

      if (familyContainer.children[this.generation]) {
        familyContainer.children[this.generation].children[1].appendChild(this.node);
      } else {
        const newRow = createRow(this.generation);
        familyContainer.appendChild(newRow);
        newRow.children[1].appendChild(this.node);
      }
    }

    this.children.forEach(child => child.renderTree());
  }
}

// Events
// Grab Age from Input Field and Store
ageInput.onchange = e => {
  state.age = e.target.value;

  errorText.style.visibility = 'hidden';
  errorText.style.height = 0;
};

// Grab Name from Input Field and Store
nameInput.onchange = e => {
  state.name = e.target.value;
};

// On Click Do Something Important
submit.onclick = () => {
  const ageAsNum = parseInt(state.age);

  if (!isNaN(ageAsNum)) {
    console.log(`${state.name} is ${state.age}, adding now!`);

    // Do something here
    if (!state.selectedMember) {
      state.selectedMember = new FamilyTree(state.name, state.age);
      state.root = state.selectedMember;
      state.root.renderTree();
      state.selectedMember.node.children[0].classList.toggle('selected');
    } else {
      state.selectedMember.insert(state.name, state.age);
      state.root.renderTree();
    }

    state.age = '';
    state.name = '';
    nameInput.value = state.name;
    ageInput.value = state.age;
  } else {
    console.error(`Error adding ${state.name} age ${state.age}. ${state.age} is not a number.`);
    errorText.style.visibility = 'visible';
    errorText.style.height = 'auto';
  }
};

// Append to DOM
container.appendChild(nameContainer);
container.appendChild(ageContainer);
container.appendChild(errorText);
container.appendChild(submit);

rootEl.appendChild(container);
rootEl.appendChild(familyContainer);
