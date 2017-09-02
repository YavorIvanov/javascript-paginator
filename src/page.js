class Page {
  constructor(order, label, states = [], dataset = {}) {
    this.order    = order;
    this.label    = label;
    this.dataset  = dataset;
    this.states   = states;
    this.node     = this.generateNode(label, states, dataset);
  }

  // Generate functional DOM link for the page hash
  generateNode(label, states = [], dataset = {}) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const text = document.createTextNode(label);
    if (states) {
      link.className = states.join(' ');
    }
    for (const data in dataset) {
      link.dataset[data] = dataset[data];
    }
    link.appendChild(text);
    item.appendChild(link);
    return item;
  }
}
