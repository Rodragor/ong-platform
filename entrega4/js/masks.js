(function(){
  function setMask(el, fn) {
    el.addEventListener('input', function() {
      var old = this.value;
      this.value = fn(old);
    }, {passive: true});
  }

  function cpfMask(v) {
    v = v.replace(/\D/g, '').slice(0,11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  }

  function telMask(v) {
    v = v.replace(/\D/g, '').slice(0,11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    return v;
  }

  function cepMask(v) {
    v = v.replace(/\D/g, '').slice(0,8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
  }

  document.addEventListener('DOMContentLoaded', function(){
    var cpf = document.getElementById('cpf');
    var tel = document.getElementById('telefone');
    var cep = document.getElementById('cep');
    if (cpf) setMask(cpf, cpfMask);
    if (tel) setMask(tel, telMask);
    if (cep) setMask(cep, cepMask);
  });
})();
