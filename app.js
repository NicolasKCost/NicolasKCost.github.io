// NicolasOS — portfólio de Nicolas Kaiky Costa. JavaScript simples, sem bibliotecas.
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const guardar = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const ler = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };

  // ------------------------------------------------------------------ dados
  const PROJETOS = [
    {
      id: "cv", nome: "Um CV por Vaga", tipo: ["saas", "ia"], resumo: "SaaS que adapta o CV a cada vaga com IA, sem inventar dados, e envia a candidatura.",
      tags: ["PHP", "JavaScript", "MySQL", "Gemini", "OAuth", "Stripe"],
      imgs: [["cv-pagina-inicial.jpg", "Página inicial"], ["cv-colar-vaga.jpg", "Colar a vaga"], ["cv-resultado.jpg", "Resultado: CV adaptado e compatibilidade"]],
      sub: "SaaS em produção · umcvporvaga.pt",
      problema: "Quem procura emprego envia o mesmo CV para todas as vagas, e os recrutadores e os filtros automáticos notam a falta de correspondência.",
      solucao: "O utilizador carrega o CV uma vez. Para cada vaga, cola o anúncio e, em cerca de um minuto, recebe a compatibilidade, o que falta e o CV reescrito só com a experiência real. Pode enviar a candidatura pelo próprio Gmail.",
      tecnico: [
        "A IA nunca decide sozinha: o PHP confirma que nenhuma experiência desaparece e corta afirmações sem prova no CV original (ex.: 'disponibilidade imediata' inventada).",
        "Créditos gastos com um único UPDATE atómico: duas abas ao mesmo tempo não gastam o mesmo crédito.",
        "Pagamentos com Stripe: webhook com assinatura HMAC verificada e idempotente (o mesmo evento não dá créditos duas vezes).",
        "Login com Google (OAuth 2.0) e envio pela Gmail API; o token fica cifrado com AES-256-GCM.",
        "Publicação com script: testes numa cópia de staging, backup, migrações e verificação HTTP.",
      ],
      links: [["umcvporvaga.pt ↗", "https://umcvporvaga.pt"], ["repositório ↗", "https://github.com/NicolasKCost/um-cv-por-vaga"]],
    },
    {
      id: "zagora", nome: "Zágora", tipo: ["ia"], resumo: "Assistente de finanças no Telegram: gastos, contas, lembretes e metas por conversa.",
      tags: ["PHP", "MySQL", "Telegram API", "IA", "Testes"],
      imgs: [["zagora-site.jpg", "Site do Zágora"]],
      sub: "Bot do Telegram · zagora.space",
      problema: "Controlar gastos em folhas de cálculo dá trabalho e as pessoas desistem ao fim de poucos dias.",
      solucao: "Escreves 'gastei 20 no mercado' ou 'lembra-me de pagar a luz dia 10' e o bot regista, calcula saldos, lembra contas e acompanha metas.",
      tecnico: [
        "A IA só interpreta a frase e devolve um JSON; as datas e os cálculos são feitos em PHP, porque o modelo errava o calendário ('segunda' virava sábado).",
        "Lembrete mensal no dia 31 calculado sem o erro do '+1 month' (31/01 → 03/03).",
        "Webhook com segredo e idempotente pelo update_id; cron com flock para não enviar o mesmo lembrete duas vezes.",
        "Suite de testes com cenários de conversas reais, a correr numa cópia de staging com rollback antes de cada publicação.",
      ],
      links: [["zagora.space ↗", "https://zagora.space"], ["repositório ↗", "https://github.com/NicolasKCost/zagora"]],
    },
    {
      id: "boletos", nome: "Portal de Boletos", tipo: ["cliente"], resumo: "Plugin WordPress para uma associação de saúde: importa PDFs, envia por e-mail e tem área do cliente.",
      tags: ["PHP", "WordPress", "$wpdb", "Composer"],
      imgs: [["boletos-dashboard.jpg", "Painel"], ["boletos-clientes.jpg", "Clientes"], ["boletos-email-template.jpg", "Modelo de e-mail"]],
      sub: "Projeto para cliente real · em produção",
      problema: "Os boletos eram enviados um a um, todos os meses, sem controlo de quem já tinha pago ou recebido.",
      solucao: "A equipa importa um ZIP com os PDFs, o plugin extrai CPF, valor e vencimento, envia por e-mail e regista pagamentos com auditoria. O cliente consulta e descarrega os boletos com CPF e um código por e-mail.",
      tecnico: [
        "Extração de dados dos PDFs com smalot/pdfparser e expressões regulares.",
        "Todas as consultas com $wpdb->prepare; cargo próprio 'Funcionário de Boletos' com permissões limitadas.",
        "Encontrei e corrigi uma falha no login do cliente (o passo do e-mail confiava num campo escondido do formulário). Testei o ataque e o uso normal no servidor, dentro de uma transação desfeita no fim, antes de publicar.",
      ],
      links: [["repositório ↗", "https://github.com/NicolasKCost/portal-boletos"]],
    },
    {
      id: "movai", nome: "MovAI-Fit", tipo: ["saas", "ia"], resumo: "App de treino instalável (PWA) com planos gerados por IA e área para personal trainers.",
      tags: ["PHP", "JavaScript", "Groq API", "PWA"],
      imgs: [["movai-home.jpg", "Início"], ["movai-treino.jpg", "Treino guiado"], ["movai-plano.jpg", "Plano gerado por IA"]],
      sub: "PWA · movaifit.me",
      problema: "Planos de treino genéricos não se adaptam à pessoa, e os personal trainers gerem os alunos em mensagens soltas.",
      solucao: "A IA gera planos a partir de uma base local de exercícios, a app guia o treino com imagens e mostra a evolução. Os trainers têm uma área para os alunos.",
      tecnico: [
        "Autenticação com token assinado (HMAC) e papéis (utilizador, trainer, admin) verificados em cada rota.",
        "A chave da IA nunca vai para o navegador: as chamadas passam por um proxy no servidor, com rotação de chaves.",
        "Webhook da Lemon Squeezy com assinatura verificada; service worker com cache diferente para API e imagens.",
      ],
      links: [["movaifit.me ↗", "https://movaifit.me"], ["repositório ↗", "https://github.com/NicolasKCost/movai-fit"]],
    },
  ];
  const CARREIRA = [
    ["???????", "em breve", "feat", "primeira vaga como dev numa equipa em Lisboa", "A próxima linha pode ser a tua empresa.", true],
    ["4f9c2ad", "2025–26", "feat", "Um CV por Vaga, Zágora, MovAI-Fit e Portal de Boletos em produção", "Aplicações completas: base de dados, autenticação, pagamentos, IA, testes e publicação em Linux."],
    ["b71e0c3", "2020", "perf", "automatizo o envio de ~850 boletos", "Durante o trabalho remoto, o que levava dias passou a ser um processo automático."],
    ["9a3d5f1", "2017–23", "feat", "Responsável de TI e Sistemas · ASSC Saúde", "Suporte aos colegas, computadores, Microsoft 365, rede, sistemas internos e cobranças."],
    ["e28b6c4", "2015–17", "feat", "Helpdesk de 1.ª linha (Contax) e formador de informática (Cinética)", "Atendimento técnico com registo de cada pedido em tickets; aulas de informática e design."],
    ["1c0ffee", "2011", "init", "design gráfico em gráficas e comunicação visual", "Onde aprendi a pensar em quem está do outro lado: depois fiz o curso de Design Gráfico na Estácio."],
  ];
  const STACK = [["php", 90], ["javascript", 82], ["mysql", 80], ["html/css", 85], ["apis rest", 78], ["wordpress", 65], ["linux/ssh", 70], ["git", 75]];

  // ------------------------------------------------------------------ arranque
  const boot = $("#boot");
  const linhasBoot = [
    ["OK", "A montar /dev/cafe"], ["OK", "A carregar módulo php.ko"], ["OK", "A carregar módulo javascript.ko"],
    ["OK", "A ligar ao mysql na porta 3306"], ["OK", "A verificar 4 projetos em produção"], ["..", "A procurar vaga de dev em Lisboa"],
  ];
  let bootFeito = false;
  const fimBoot = () => {
    if (bootFeito) return; bootFeito = true;
    boot.classList.add("sai"); setTimeout(() => boot.remove(), 600);
    guardar("nicolasos-boot", "1");
    iniciarHero();
  };
  if (ler("nicolasos-boot") || calmo || location.search.includes("semboot")) { boot.remove(); bootFeito = true; iniciarHero(); }
  else {
    const log = $("#boot-log"), fill = $("#boot-fill");
    log.textContent = "NicolasOS v2.0 (tty1)\n\n";
    linhasBoot.forEach(([st, t], i) => setTimeout(() => {
      log.innerHTML += `<span style="color:#7d8590">[</span><span style="color:${st === "OK" ? "#00ff9c" : "#e3b341"}"> ${st} </span><span style="color:#7d8590">]</span> ${t}\n`;
      fill.style.width = ((i + 1) / linhasBoot.length * 100) + "%";
    }, 250 + i * 330));
    setTimeout(() => { log.innerHTML += `\n<span style="color:#00ff9c">ACESSO CONCEDIDO</span>`; }, 250 + linhasBoot.length * 330);
    setTimeout(fimBoot, 750 + linhasBoot.length * 330);
    ["keydown", "click", "touchstart"].forEach(ev => addEventListener(ev, fimBoot, { once: true }));
  }

  // ------------------------------------------------------------------ hero
  function iniciarHero() {
    // nome a desencriptar
    const h1 = $("#nome"), alvo = h1.dataset.txt, lixo = "#$%&@!?<>/\\{}[]01ABCDEFXZ";
    if (!calmo) {
      let f = 0;
      const t = setInterval(() => {
        h1.innerHTML = [...alvo].map((ch, i) => ch === " " ? " " : (f > i * 2 + 6 ? esc(ch) : `<span class="x">${esc(lixo[Math.random() * lixo.length | 0])}</span>`)).join("");
        if (++f > alvo.length * 2 + 8) { clearInterval(t); h1.textContent = alvo; }
      }, 45);
    }
    escrever($("#hero-cmd"), "./apresentar.sh --modo=hacker", 40);
    // papéis em rotação
    const papeis = ["Desenvolvedor Web Júnior", "PHP · JavaScript · MySQL", "4 projetos em produção", "Suporte de TI desde 2015", "Disponível em Lisboa"];
    let p = 0;
    setInterval(() => { p = (p + 1) % papeis.length; apagarEscrever($("#papel"), papeis[p]); }, 3200);
  }
  function escrever(el, txt, ms, fim) { let i = 0; el.textContent = ""; const t = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i >= txt.length) { clearInterval(t); fim && fim(); } }, ms); }
  function apagarEscrever(el, novo) {
    if (calmo) { el.textContent = novo; return; }
    const t = setInterval(() => { el.textContent = el.textContent.slice(0, -1); if (!el.textContent) { clearInterval(t); escrever(el, novo, 35); } }, 18);
  }

  // chuva de caracteres no fundo
  (function chuva() {
    const cv = $("#chuva"), cx = cv.getContext("2d");
    let cols, gotas, w, h;
    const tam = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight; cols = Math.floor(w / 18); gotas = Array.from({ length: cols }, () => Math.random() * -40); };
    tam(); addEventListener("resize", tam);
    const ch = "01ABCDEF<>/{}$#=+*";
    const passo = () => {
      cx.fillStyle = "rgba(10,14,20,0.14)"; cx.fillRect(0, 0, w, h);
      cx.font = "15px JetBrains Mono, monospace";
      for (let i = 0; i < cols; i++) {
        cx.fillStyle = Math.random() > .975 ? "#e6edf3" : "#00ff9c";
        cx.fillText(ch[Math.random() * ch.length | 0], i * 18, gotas[i] * 18);
        if (gotas[i] * 18 > h && Math.random() > .975) gotas[i] = 0;
        gotas[i] += .55;
      }
    };
    if (calmo) { passo(); return; }
    let ultimo = 0;
    const loop = ts => { if (ts - ultimo > 50) { passo(); ultimo = ts; } requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  })();

  // ------------------------------------------------------------------ barra: relógio, menu, secção ativa
  const relogio = () => { $("#relogio").textContent = new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" }) + " Lisboa"; };
  relogio(); setInterval(relogio, 15000);
  $("#btn-menu").onclick = () => $("#menu").classList.toggle("aberto");
  $$("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("aberto")));
  const obsSec = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$("#menu a").forEach(a => a.classList.toggle("ativo", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => obsSec.observe(s));

  // ------------------------------------------------------------------ sobre: perfil.json a escrever-se + git log
  const json = [
    ['<span class="cm">// whoami --verbose</span>'], ["{"],
    ['  <span class="k">"nome"</span>: <span class="s">"Nicolas Kaiky Costa"</span>,'],
    ['  <span class="k">"cargo"</span>: <span class="s">"Desenvolvedor Web Júnior"</span>,'],
    ['  <span class="k">"local"</span>: <span class="s">"Lisboa, Portugal"</span>,'],
    ['  <span class="k">"stack"</span>: [<span class="s">"PHP"</span>, <span class="s">"JavaScript"</span>, <span class="s">"MySQL"</span>, <span class="s">"APIs REST"</span>],'],
    ['  <span class="k">"ferramentas"</span>: [<span class="s">"Git"</span>, <span class="s">"Linux/SSH"</span>, <span class="s">"WordPress"</span>, <span class="s">"Claude Code"</span>],'],
    ['  <span class="k">"experiencia"</span>: {'],
    ['    <span class="k">"suporte_ti"</span>: <span class="s">"helpdesk + 7 anos de responsável de TI"</span>,'],
    ['    <span class="k">"design"</span>: <span class="s">"design gráfico e digital"</span>,'],
    ['    <span class="k">"dev"</span>: <span class="s">"aplicações web da base de dados ao servidor"</span>'],
    ["  },"],
    ['  <span class="k">"projetos_em_producao"</span>: <span class="n">4</span>,'],
    ['  <span class="k">"disponivel"</span>: <span class="b">true</span>,'],
    ['  <span class="k">"proxima_missao"</span>: <span class="s">"primeira vaga como dev em Lisboa"</span>'],
    ["}"],
  ];
  const pre = $("#perfil-json");
  let jsonFeito = false;
  const escreverJson = () => {
    if (jsonFeito) return; jsonFeito = true;
    json.forEach(([l], i) => setTimeout(() => { pre.innerHTML += l + "\n"; }, calmo ? 0 : i * 110));
  };
  $("#gitlog").innerHTML = CARREIRA.map(([h, y, t, m, d, next], i) =>
    `<li style="--i:${i}"${next ? ' class="next"' : ""}><span class="h">${h}</span> <span class="y">[${y}]</span> <span class="t">${t}:</span> ${esc(m)}<span class="d">${esc(d)}</span></li>`).join("");

  // aparecer ao entrar no ecrã
  const obsRevela = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visto");
    if (e.target.querySelector && e.target.querySelector("#perfil-json")) escreverJson();
    if (e.target.querySelector && e.target.querySelector("#htop")) encherHtop();
    obsRevela.unobserve(e.target);
  }), { threshold: .15 });
  $$(".revela").forEach(el => obsRevela.observe(el));

  // ------------------------------------------------------------------ projetos
  const FILTROS = [["todos", "todos"], ["saas", "SaaS"], ["ia", "com IA"], ["cliente", "para cliente"]];
  let filtro = "todos";
  function desenharProjetos() {
    $("#grid-proj").innerHTML = PROJETOS.filter(p => filtro === "todos" || p.tipo.includes(filtro)).map(p => `
      <button class="proj revela visto" data-id="${p.id}">
        <div class="shot" style="background-image:url('assets/img/${p.imgs[0][0]}')"></div>
        <div class="pi"><h3>${esc(p.nome)} <span class="on">● online</span></h3><p>${esc(p.resumo)}</p>
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div></div>
      </button>`).join("");
    $$(".proj").forEach(b => b.onclick = () => abrirProjeto(b.dataset.id));
  }
  $("#filtros").innerHTML = FILTROS.map(([v, t]) => `<button data-f="${v}" class="${v === filtro ? "on" : ""}">${t}</button>`).join("");
  $$("#filtros button").forEach(b => b.onclick = () => { filtro = b.dataset.f; $$("#filtros button").forEach(x => x.classList.toggle("on", x === b)); desenharProjetos(); });
  desenharProjetos();

  // janela do projeto (arrastável no computador)
  const modal = $("#modal"), janela = $("#modal-janela");
  let ultimoFoco = null;
  function abrirProjeto(id) {
    const p = PROJETOS.find(x => x.id === id); if (!p) return;
    ultimoFoco = document.activeElement;
    let g = 0;
    $("#modal-path").textContent = `~/projetos/${p.id}/README.md`;
    $("#modal-corpo").innerHTML = `
      <div class="galeria"><img id="g-img" src="assets/img/${p.imgs[0][0]}" alt="${esc(p.imgs[0][1])}">
        ${p.imgs.length > 1 ? '<button class="nav ant" aria-label="Imagem anterior">◀</button><button class="nav seg" aria-label="Imagem seguinte">▶</button>' : ""}
        <span class="leg" id="g-leg">${esc(p.imgs[0][1])} · 1/${p.imgs.length}</span></div>
      <div class="m-txt">
        <h3 id="modal-titulo">${esc(p.nome)}</h3><p class="sub">${esc(p.sub)}</p>
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <h4>// o problema</h4><p>${esc(p.problema)}</p>
        <h4>// a solução</h4><p>${esc(p.solucao)}</p>
        <h4>// decisões técnicas</h4><ul>${p.tecnico.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="m-links">${p.links.map(([t, u]) => `<a class="btn${u.includes("github") ? " alt" : ""}" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</div>
      </div>`;
    const mostra = d => { g = (g + d + p.imgs.length) % p.imgs.length; $("#g-img").src = "assets/img/" + p.imgs[g][0]; $("#g-img").alt = p.imgs[g][1]; $("#g-leg").textContent = `${p.imgs[g][1]} · ${g + 1}/${p.imgs.length}`; };
    const ant = $("#modal-corpo .ant"), seg = $("#modal-corpo .seg");
    if (ant) { ant.onclick = () => mostra(-1); seg.onclick = () => mostra(1); }
    janela.style.transform = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal-fechar").focus();
    modal.onkeydown = e => { if (e.key === "ArrowLeft" && ant) mostra(-1); if (e.key === "ArrowRight" && seg) mostra(1); };
  }
  function fecharModal() { modal.hidden = true; document.body.style.overflow = ""; ultimoFoco && ultimoFoco.focus(); }
  $("#modal-fechar").onclick = fecharModal;
  modal.addEventListener("click", e => { if (e.target === modal) fecharModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) fecharModal(); });
  (function arrastar() {
    const bar = $("#modal-bar"); let x0, y0, dx = 0, dy = 0, a = false;
    bar.addEventListener("pointerdown", e => { if (e.target.closest("button") || innerWidth < 860) return; a = true; x0 = e.clientX - dx; y0 = e.clientY - dy; bar.setPointerCapture(e.pointerId); });
    bar.addEventListener("pointermove", e => { if (!a) return; dx = e.clientX - x0; dy = e.clientY - y0; janela.style.transform = `translate(${dx}px, ${dy}px)`; });
    bar.addEventListener("pointerup", () => { a = false; });
    new MutationObserver(() => { if (!modal.hidden) { dx = dy = 0; } }).observe(modal, { attributes: true });
  })();

  // ------------------------------------------------------------------ htop
  $("#htop").innerHTML = STACK.map(([n, v], i) => `<div class="meter"><span class="i">${i + 1}</span><span class="l">${n}</span><span class="bar"><i data-v="${v}"></i></span></div>`).join("");
  function encherHtop() {
    $$("#htop i").forEach(i => { i.style.width = i.dataset.v + "%"; });
    if (calmo) return;
    setInterval(() => $$("#htop i").forEach(i => { const v = +i.dataset.v; i.style.width = Math.max(30, Math.min(100, v + (Math.random() * 8 - 4))) + "%"; }), 2600);
  }

  // ------------------------------------------------------------------ terminal
  const out = $("#term-out"), inp = $("#term-in"), term = $("#term");
  const hist = []; let hi = 0;
  const print = (html, cls) => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); term.scrollTop = term.scrollHeight; };
  const COMANDOS = {
    help: () => print(`Comandos disponíveis:
  <span class="c">sobre</span>        quem sou
  <span class="c">projetos</span>     lista os projetos
  <span class="c">abrir</span> &lt;id&gt;   abre um projeto (cv, zagora, boletos, movai)
  <span class="c">stack</span>        tecnologias
  <span class="c">cv</span>           descarrega o currículo
  <span class="c">contacto</span>     como falar comigo
  <span class="c">jogar</span>        caça aos bugs
  <span class="c">matrix</span>       ...
  <span class="c">clear</span>        limpa o ecrã
  <span class="dim">e há mais um escondido, para recrutadores.</span>`),
    sobre: () => print("Nicolas Kaiky Costa · Desenvolvedor Web Júnior em Lisboa.\nDesign gráfico → helpdesk → 7 anos de responsável de TI → aplicações web em produção.\nPHP, JavaScript, MySQL, APIs REST, Linux. Disponível de imediato."),
    whoami: () => COMANDOS.sobre(),
    projetos: () => print(PROJETOS.map(p => `<span class="g">●</span> <span class="c">${p.id.padEnd(8)}</span> ${esc(p.nome)} — ${esc(p.resumo)}`).join("\n") + `\n<span class="dim">usa: abrir cv</span>`),
    ls: () => print(`<span class="c">projetos/</span>  <span class="c">games/</span>  sobre.md  cv.pdf  contacto.txt  <span class="dim">.segredo</span>`),
    abrir: a => { const p = PROJETOS.find(x => x.id === (a || "").trim()); if (!p) return print(`abrir: projeto '${esc(a || "")}' não encontrado. Tenta: cv, zagora, boletos, movai`, "r"); print(`a abrir ${esc(p.nome)}...`); setTimeout(() => abrirProjeto(p.id), 300); },
    stack: () => print(STACK.map(([n, v]) => `${n.padEnd(11)} [${"|".repeat(Math.round(v / 5)).padEnd(20)}]`).join("\n")),
    cv: () => { print("a descarregar cv.pdf ↓"); const a = document.createElement("a"); a.href = "assets/Nicolas_Kaiky_Costa_CV.pdf"; a.download = ""; a.click(); },
    contacto: () => print(`email     <a href="mailto:nicolaskcost@gmail.com">nicolaskcost@gmail.com</a>\nlinkedin  <a href="https://www.linkedin.com/in/nicolas-kaiky" target="_blank" rel="noopener">in/nicolas-kaiky</a>\ngithub    <a href="https://github.com/NicolasKCost" target="_blank" rel="noopener">NicolasKCost</a>`),
    jogar: () => { print("a abrir ~/games/caca-bugs.exe ..."); $(".jogo-wrap").scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(iniciarJogo, 500); },
    clear: () => { out.innerHTML = ""; },
    cat: a => { if ((a || "").includes("segredo")) print("Antes do código fui designer gráfico e dei aulas de informática a crianças.\nHoje junto tudo: código que funciona e interfaces que se percebem.", "g"); else print(`cat: ${esc(a || "")}: ficheiro protegido. Experimenta: cat .segredo`); },
    matrix: () => { print("A acordar, Neo...", "g"); document.querySelector(".hero").scrollIntoView({ behavior: "smooth" }); },
    sudo: a => {
      if (/contrat/.test(a || "")) {
        print("[sudo] palavra-passe para recrutador: ********", "dim");
        setTimeout(() => { print("✓ permissão concedida. A preparar entrevista...", "g"); festa(); }, 700);
      } else print("visitante não está no ficheiro sudoers. Este incidente será reportado. 😉");
    },
    exit: () => print("logout? Ainda não! Experimenta 'projetos'."),
    pwd: () => print("/home/visitante"),
    date: () => print(new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" })),
    echo: a => print(esc(a || "")),
  };
  function correr(linha) {
    print(`<span class="g">visitante@nicolas</span>:<span class="c">~</span>$ ${esc(linha)}`);
    const [cmd, ...resto] = linha.trim().split(/\s+/);
    if (!cmd) return;
    const f = COMANDOS[cmd.toLowerCase()];
    if (f) f(resto.join(" ")); else print(`${esc(cmd)}: comando não encontrado. Escreve <span class="c">help</span>.`);
  }
  $("#term-form").onsubmit = e => { e.preventDefault(); const v = inp.value; if (v.trim()) { hist.push(v); hi = hist.length; } inp.value = ""; correr(v); };
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && hi > 0) { inp.value = hist[--hi]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); }
    if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(COMANDOS).filter(c => c.startsWith(inp.value)); if (m.length === 1) inp.value = m[0] + " "; }
  });
  term.addEventListener("click", () => inp.focus({ preventScroll: true }));
  ["help", "sobre", "projetos", "abrir cv", "cv", "jogar", "sudo contratar-nicolas"].forEach(c => {
    const b = document.createElement("button"); b.textContent = c; b.onclick = () => correr(c); $("#atalhos").appendChild(b);
  });
  print(`NicolasOS v2.0 · bem-vindo, visitante.\nEscreve <span class="c">help</span> para ver os comandos.`, "dim");

  function festa() {
    const f = document.createElement("div"); f.className = "festa";
    f.innerHTML = "<div>🎉 ACESSO CONCEDIDO 🎉<br><small style='font-size:.4em;color:#e6edf3'>nicolaskcost@gmail.com</small></div>";
    document.body.appendChild(f); setTimeout(() => f.remove(), 3100);
  }

  // ------------------------------------------------------------------ contacto
  $("#copiar-email").onclick = async () => {
    try { await navigator.clipboard.writeText("nicolaskcost@gmail.com"); $("#copiado").textContent = "copiado ✓"; toast("e-mail copiado"); }
    catch (e) { location.href = "mailto:nicolaskcost@gmail.com"; }
  };
  function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, 1800); }

  // ------------------------------------------------------------------ jogo: caça aos bugs
  const cv = $("#jogo"), cx = cv.getContext("2d"), C = 20, W = cv.width / C, H = cv.height / C;
  let cobra, dir, prox, bug, pontos, loopJogo = null, recorde = 0;
  try { recorde = +localStorage.getItem("cacabugs-recorde") || 0; } catch (e) {}
  $("#recorde").textContent = recorde;
  const novoBug = () => { do { bug = { x: Math.random() * W | 0, y: Math.random() * H | 0 }; } while (cobra.some(s => s.x === bug.x && s.y === bug.y)); };
  function desenharJogo(msg) {
    cx.fillStyle = "#05080c"; cx.fillRect(0, 0, cv.width, cv.height);
    cx.strokeStyle = "#0f1a14"; for (let x = 0; x <= W; x++) { cx.beginPath(); cx.moveTo(x * C, 0); cx.lineTo(x * C, cv.height); cx.stroke(); }
    for (let y = 0; y <= H; y++) { cx.beginPath(); cx.moveTo(0, y * C); cx.lineTo(cv.width, y * C); cx.stroke(); }
    if (bug) { cx.font = "16px serif"; cx.fillText("🐞", bug.x * C + 1, bug.y * C + 16); }
    if (cobra) cobra.forEach((s, i) => { cx.fillStyle = i ? `rgba(0,255,156,${Math.max(.35, 1 - i * .04)})` : "#e6edf3"; cx.fillRect(s.x * C + 2, s.y * C + 2, C - 4, C - 4); });
    if (msg) { cx.fillStyle = "#000b"; cx.fillRect(0, cv.height / 2 - 30, cv.width, 60); cx.fillStyle = "#00ff9c"; cx.font = "bold 18px JetBrains Mono, monospace"; cx.textAlign = "center"; cx.fillText(msg, cv.width / 2, cv.height / 2 + 6); cx.textAlign = "start"; }
  }
  function iniciarJogo() {
    cobra = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]; dir = prox = { x: 1, y: 0 }; pontos = 0; $("#pontos").textContent = 0; novoBug();
    clearInterval(loopJogo);
    loopJogo = setInterval(() => {
      dir = prox;
      const c = { x: (cobra[0].x + dir.x + W) % W, y: (cobra[0].y + dir.y + H) % H };
      if (cobra.some(s => s.x === c.x && s.y === c.y)) {
        clearInterval(loopJogo); loopJogo = null;
        if (pontos > recorde) { recorde = pontos; try { localStorage.setItem("cacabugs-recorde", recorde); } catch (e) {} $("#recorde").textContent = recorde; }
        desenharJogo(`segfault! ${pontos} bugs resolvidos`); $("#jogar").textContent = "↻ outra vez"; return;
      }
      cobra.unshift(c);
      if (c.x === bug.x && c.y === bug.y) { pontos++; $("#pontos").textContent = pontos; novoBug(); } else cobra.pop();
      desenharJogo();
    }, 120);
    $("#jogar").textContent = "↻ recomeçar";
  }
  const muda = d => { const m = { u: { x: 0, y: -1 }, d: { x: 0, y: 1 }, l: { x: -1, y: 0 }, r: { x: 1, y: 0 } }[d]; if (!m || !loopJogo) return; if (m.x !== -dir.x || m.y !== -dir.y) prox = m; };
  addEventListener("keydown", e => {
    const d = { ArrowUp: "u", ArrowDown: "d", ArrowLeft: "l", ArrowRight: "r" }[e.key];
    if (d && loopJogo && document.activeElement !== inp) { e.preventDefault(); muda(d); }
  });
  $$(".pad button").forEach(b => b.onclick = () => muda(b.dataset.d));
  let tx, ty;
  cv.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  cv.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return; muda(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "r" : "l") : (dy > 0 ? "d" : "u")); });
  $("#jogar").onclick = iniciarJogo;
  cobra = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]; bug = { x: 15, y: 7 }; desenharJogo("carrega em ▶ jogar");
})();
