self.onmessage = function(e) {
    if (e.data === 'start') {
      const sum = heavyCalculation();
      postMessage(sum);
    }
  };
  
  // Fonction simulant un calcul lourd
  function heavyCalculation() {
    let sum = 0;
    for (let i = 0; i < 1e10; i++) {
      sum += i;
    }
    return sum;
  }
  