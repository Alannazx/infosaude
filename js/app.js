/* InfoSaúde Digital: sem armazenamento de dados, tudo roda no navegador. */
const $ = (s) => document.querySelector(s);
const norm = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let cat = "todas";

function card(x) {
  const c = CATS[x.c];
  return `<article class="card dz" tabindex="0" data-id="${x.id}">
    <div class="ic">${x.i}</div><span class="tag">${c.n}</span>
    <h3>${x.n}</h3><p>${x.d}</p>
    <button class="btn sm" data-id="${x.id}">Saiba mais</button></article>`;
}

function renderCats() {
  $("#cats").innerHTML = Object.entries(CATS).map(([k, c]) =>
    `<article class="card"><div class="ic">${c.i}</div><h3>${c.n}</h3><p>${c.d}</p>
     <a class="btn sm alt" href="${k === "ists" ? "#ists" : "#doencas"}" data-cat="${k}">Acessar categoria</a></article>`).join("");
  $("#chips").innerHTML = [["todas", "Todas"], ...Object.entries(CATS).map(([k, c]) => [k, c.n])]
    .map(([k, n]) => `<button class="chip" data-cat="${k}" aria-pressed="${k === cat}">${n}</button>`).join("");
  $("#istlist").innerHTML = D.filter((x) => x.c === "ists").map(card).join("");
  $("#prev").innerHTML = PREV.map(([i, t, d]) => `<article class="card"><div class="ic">${i}</div><h3>${t}</h3><p>${d}</p></article>`).join("");
}

function renderList() {
  const q = norm($("#q").value.trim());
  const r = D.filter((x) => (cat === "todas" || x.c === cat) && norm(x.n).includes(q));
  $("#list").innerHTML = r.map(card).join("");
  $("#none").hidden = r.length > 0;
  document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === cat));
}

function sec(t, v) { return v ? `<section><h3>${t}</h3><p>${v}</p></section>` : ""; }

function openDisease(id) {
  const x = D.find((d) => d.id === id);
  if (!x) return;
  $("#dt").textContent = `${x.i} ${x.n}`;
  const ist = x.c === "ists";
  $("#db").innerHTML =
    `<span class="tag">${CATS[x.c].n}</span>` +
    sec("O que é?", x.o) + sec("Agente causador", x.a) +
    sec("Como ocorre a transmissão?", x.t) +
    sec(ist ? "Sinais e sintomas (podem não existir)" : "Principais sinais e sintomas", x.s + " Os sinais variam entre as pessoas e não servem para confirmar a doença.") +
    sec("Prevenção", x.p) + sec("Diagnóstico", x.g) +
    sec("Tratamento e acompanhamento", x.r) + sec("Quando procurar atendimento?", x.q) +
    `<section><h3>Fontes confiáveis</h3><p><a href="${x.f}" target="_blank" rel="noopener noreferrer">Ficha da OMS sobre ${x.n} ↗</a><br>
     <a href="https://www.gov.br/saude/pt-br" target="_blank" rel="noopener noreferrer">Ministério da Saúde ↗</a></p></section>
     <p class="note">Conteúdo educativo. Não substitui orientação de profissionais de saúde.</p>`;
  const dlg = $("#dlg");
  dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  $("#db").scrollTop = 0;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-id]");
  if (b) return openDisease(b.dataset.id);
  const c = e.target.closest("[data-cat]");
  if (c) { cat = c.dataset.cat; $("#q").value = ""; renderList(); }
  if (e.target.closest("#nav a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches(".card.dz")) openDisease(e.target.dataset.id);
});
$("#q").addEventListener("input", renderList);
$("#x").addEventListener("click", () => $("#dlg").close());
$("#dlg").addEventListener("click", (e) => { if (e.target.id === "dlg") e.target.close(); });

function closeMenu() { $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); }
$("#burger").addEventListener("click", () => {
  const o = $("#nav").classList.toggle("open");
  $("#burger").setAttribute("aria-expanded", o);
});
$("#top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => { $("#top").hidden = window.scrollY < 500; });

renderCats();
renderList();
