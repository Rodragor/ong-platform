export function renderHome() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Nossa Missão</h1>
      <p>Promover inclusão social por meio de ações educativas e ambientais.</p>
      <p><a class="btn btn-primary" href="#/cadastro" data-link>Quero participar</a></p>
    </section>

    <section class="section" aria-labelledby="banner-title">
      <h2 id="banner-title" class="visually-hidden">Imagem de destaque</h2>
      <picture>
        <source srcset="images/header-project.webp" type="image/webp">
        <source srcset="images/header-project.jpg" type="image/jpeg">
        <img src="images/header-project.jpg" alt="Voluntários em ação na natureza" loading="lazy" width="1200" height="500">
      </picture>
    </section>
  `;
}

export function renderProjetos({ searchParams }) {
  const tab = searchParams.get('tab') || 'andamento';
  return `
    <h1>Projetos Sociais</h1>
    <p>Conheça os projetos em andamento, como participar e apoiar.</p>

    <nav class="section" aria-label="Abas de Projetos">
      <a class="btn ${tab==='andamento'?'btn-primary':'btn-ghost'}" href="#/projetos?tab=andamento" data-link>Em andamento</a>
      <a class="btn ${tab==='doar'?'btn-primary':'btn-ghost'}" href="#/projetos?tab=doar" data-link>Como doar</a>
      <a class="btn ${tab==='voluntariado'?'btn-primary':'btn-ghost'}" href="#/projetos?tab=voluntariado" data-link>Voluntariado</a>
    </nav>

    ${tab === 'andamento' ? sectionAndamento() : tab === 'doar' ? sectionDoar() : sectionVoluntariado()}
  `;
}

function sectionAndamento() {
  return `
    <section class="section" aria-labelledby="dest">
      <h2 id="dest">Em andamento</h2>
      <div class="cards">
        ${card('Escola Verde','images/volunteer.jpg','Meio Ambiente','Educação ambiental nas escolas públicas.')}
        ${card('Alfabetiza+','images/header-project.jpg','Educação','Reforço escolar e alfabetização.')}
        ${card('Horta Comunitária','images/header-project.jpg','Comunidade','Produção de alimentos para famílias.')}
      </div>
    </section>
  `;
}

function sectionDoar() {
  return `
    <section class="section" aria-labelledby="doar-title">
      <h2 id="doar-title">Como doar</h2>
      <p>Você pode apoiar com doações pontuais ou recorrentes.</p>
      <p><a class="btn btn-secondary" href="#/cadastro" data-link>Quero doar</a></p>
    </section>
  `;
}

function sectionVoluntariado() {
  return `
    <section class="section" aria-labelledby="vol-title">
      <h2 id="vol-title">Voluntariado</h2>
      <p>Inscreva-se e faça parte de nossas ações sociais.</p>
      <p><a class="btn btn-primary" href="#/cadastro" data-link>Quero ser voluntário</a></p>
    </section>
  `;
}

function card(titulo, img, tag, desc) {
  const badgeClass = tag === 'Meio Ambiente' ? 'green' : (tag === 'Educação' ? 'blue' : 'amber');
  return `
    <article class="card span-12 md-span-6 lg-span-4">
      <div class="card-media">
        <img src="${img}" alt="${titulo}">
      </div>
      <div class="card-body">
        <div class="card-title">${titulo}</div>
        <div class="card-meta"><span class="badge ${badgeClass}">${tag}</span></div>
        <p>${desc}</p>
        <a class="btn btn-primary" href="#/cadastro" data-link>Participar</a>
      </div>
    </article>
  `;
}

export function renderCadastro() {
  return `
    <h1>Cadastro</h1>
    <p>Preencha os dados para se candidatar como voluntário ou apoiar financeiramente.</p>

    <form id="cadastroForm" class="form" action="#" method="post" novalidate>
      <fieldset>
        <legend>Dados pessoais</legend>

        <label for="nome">Nome Completo</label>
        <input id="nome" name="nome" type="text" required minlength="3" />

        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" required />

        <label for="cpf">CPF</label>
        <input id="cpf" name="cpf" type="text" inputmode="numeric"
               placeholder="000.000.000-00"
               pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}"
               maxlength="14" required aria-describedby="cpfHelp" />
        <small id="cpfHelp" class="visually-hidden">Formato: 000.000.000-00</small>

        <label for="telefone">Telefone</label>
        <input id="telefone" name="telefone" type="tel" inputmode="tel"
               placeholder="(00) 00000-0000"
               pattern="\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}"
               maxlength="15" required />

        <label for="nascimento">Data de Nascimento</label>
        <input id="nascimento" name="nascimento" type="date" required />
      </fieldset>

      <fieldset>
        <legend>Endereço</legend>
        <label for="endereco">Endereço</label>
        <input id="endereco" name="endereco" type="text" required />

        <label for="cep">CEP</label>
        <input id="cep" name="cep" type="text" inputmode="numeric"
               placeholder="00000-000"
               pattern="[0-9]{5}-[0-9]{3}" maxlength="9" required />

        <label for="cidade">Cidade</label>
        <input id="cidade" name="cidade" type="text" required />

        <label for="estado">Estado</label>
        <select id="estado" name="estado" required>
          <option value="">Selecione</option>
          <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option>
          <option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option>
          <option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
          <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option>
          <option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option>
          <option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
          <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
        </select>
      </fieldset>

      <fieldset>
        <legend>Preferências</legend>
        <label><input type="checkbox" name="voluntario" /> Quero ser voluntário</label>
        <label><input type="checkbox" name="newsletter" /> Receber newsletter</label>
      </fieldset>

      <p>
        <button type="submit" class="btn btn-primary">Enviar Cadastro</button>
        <button type="reset" class="btn btn-ghost">Limpar</button>
      </p>

      <div id="form-messages" aria-live="polite"></div>
    </form>
  `;
}
