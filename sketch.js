function setup() {
  createCanvas(800, 800);
  background(255);
  const numNeurons = floor(random(3, 8));
  neurons = createNeurons(numNeurons);
  connectNeurons(neurons);
}

function draw() {
  background(255);
  for (const neuron of neurons) {
    neuron.render();
  }
}

function createNeurons(numNeurons) {
  const neuronList = [];
  for (let i = 0; i < numNeurons; i++) {
    const x = random(width);
    const y = random(height);
    neuronList.push(new Neuron(x, y));
  }
  return neuronList;
}

function connectNeurons(neurons) {
  for (let i = 0; i < neurons.length; i++) {
    const currentNeuron = neurons[i];
    const connectedNeuron = neurons[(i + 1) % neurons.length];
    currentNeuron.addOutputConnection(connectedNeuron);
    connectedNeuron.addInputConnection(currentNeuron);
  }
}

// Step 2: Define a Neuron class
class Neuron {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.somaSize = 50;
    this.dendrites = []; // An array of dendrite objects
    this.axon = {}; // An axon object
    this.inputSynapses = []; // Add this line
    this.outputSynapses = []; // Add this line
  }

  // Step 3: Implement Neuron class methods
  render() {
    this.renderSoma();
    this.renderDendrites();
    this.renderAxon();
    this.renderAxonTerminals();
    this.renderSynapses();
    this.inputSynapses = [];
    this.outputSynapses = [];
  }

  addInputConnection(inputNeuron) {
  this.inputSynapses.push(inputNeuron);
  }

  addOutputConnection(outputNeuron) {
    this.outputSynapses.push(outputNeuron);
  }
  
  renderSoma() {
    fill(100, 200, 255);
    ellipse(this.position.x, this.position.y, this.somaSize);
  }

  renderDendrites() {
    // You can add more dendrites with different properties
    this.dendrites = [
      {
        startX: this.position.x,
        startY: this.position.y,
        endX: this.position.x - 100,
        endY: this.position.y - 150,
        spines: 5
      },
      {
        startX: this.position.x,
        startY: this.position.y,
        endX: this.position.x + 100,
        endY: this.position.y - 150,
        spines: 7
      }
    ];

    stroke(255, 120, 0);
    strokeWeight(2);

    for (const dendrite of this.dendrites) {
      line(dendrite.startX, dendrite.startY, dendrite.endX, dendrite.endY);
      this.renderDendriticSpines(dendrite);
    }
  }

  renderDendriticSpines(dendrite) {
    stroke(0, 200, 100);
    strokeWeight(1);

    for (let i = 0; i < dendrite.spines; i++) {
      const t = i / (dendrite.spines - 1);
      const x = lerp(dendrite.startX, dendrite.endX, t);
      const y = lerp(dendrite.startY, dendrite.endY, t);
      const length = 10;
      const angle = atan2(dendrite.endY - dendrite.startY, dendrite.endX - dendrite.startX) - PI / 2;
      const dx = x + length * cos(angle);
      const dy = y + length * sin(angle);
      line(x, y, dx, dy);
    }
  }

  renderAxon() {
    this.axon = {
      startX: this.position.x,
      startY: this.position.y,
      endX: this.position.x,
      endY: this.position.y + 200,
      terminals: 3
    };

    stroke(100, 0, 255);
    strokeWeight(2);
    line(this.axon.startX, this.axon.startY, this.axon.endX, this.axon.endY);
  }

    renderAxonTerminals() {
    fill(255, 100, 150);
    noStroke();

    for (let i = 0; i < this.axon.terminals; i++) {
      const t = i / (this.axon.terminals - 1);
      const x = lerp(this.axon.startX, this.axon.endX, t);
      const y = lerp(this.axon.startY, this.axon.endY, t);
      const terminalSize = 10;
      ellipse(x, y, terminalSize);
    }
  }


  renderSynapses() {
    stroke(200, 0, 200);
    strokeWeight(1);

    for (const inputNeuron of this.inputSynapses) {
      for (let i = 0; i < inputNeuron.axon.terminals; i++) {
        const axonT = i / (inputNeuron.axon.terminals - 1);
        const axonX = lerp(inputNeuron.axon.startX, inputNeuron.axon.endX, axonT);
        const axonY = lerp(inputNeuron.axon.startY, inputNeuron.axon.endY, axonT);

        for (const dendrite of this.dendrites) {
          for (let j = 0; j < dendrite.spines; j++) {
            const dendriteT = j / (dendrite.spines - 1);
            const dendriteX = lerp(dendrite.startX, dendrite.endX, dendriteT);
            const dendriteY = lerp(dendrite.startY, dendrite.endY, dendriteT);
            line(axonX, axonY, dendriteX, dendriteY);
          }
        }
      }
    }
  }
}
