// ==========================================
// CLASSE BASE: AVATAR
// ==========================================
class Avatar {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._coins = 0;
        this._hp = 10;
        this._damage = 1;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get coins() { return this._coins; }
    get hp() { return this._hp; }
    get damage() { return this._damage; }

    _isAlive() { return this._hp > 0; }

    forward() { if (this._isAlive()) { this._y++; return true; } return false; }
    back() { if (this._isAlive() && this._y > 0) { this._y--; return true; } return false; }
    right() { if (this._isAlive()) { this._x++; return true; } return false; }
    left() { if (this._isAlive() && this._x > 0) { this._x--; return true; } return false; }

    addCoin() { if (this._isAlive()) { this._coins++; return true; } return false; }
    
    attack() { 
        if (!this._isAlive()) return 0;
        return this._damage; 
    }

    takeDamage(amount) {
        if (!this._isAlive()) return;
        this._hp -= amount;
        if (this._hp < 0) this._hp = 0;
    }
}

// ==========================================
// SUBCLASSE: COWBOY
// ==========================================
class Cowboy extends Avatar {
    constructor(x, y) {
        super(x, y); // Chama o construtor do pai (Avatar)
        this._ammo = 10; // Atributo novo
        this._damage = 2; // Sobrescreve dano inicial
    }

    get ammo() { return this._ammo; }

    // Sobrescreve o método attack
    attack() {
        if (!this._isAlive()) return 0;

        if (this._ammo > 0) {
            this._ammo--; // Gasta bala
            return this._damage; // Retorna dano (2)
        } else {
            return 0; // Sem munição, não ataca
        }
    }

    // Método novo específico
    addAmmo() {
        if (this._isAlive()) {
            this._ammo++;
            return true;
        }
        return false;
    }
}

// ==========================================
// SUBCLASSE: MAGO
// ==========================================
class Mago extends Avatar {
    constructor(x, y, onUpdateUI) {
        super(x, y);
        this._spells = 10; // Atributo novo
        this._damage = 3; // Sobrescreve dano inicial
        
        // Callback para atualizar a tela quando a recarga acontecer
        this.onUpdateUI = onUpdateUI; 
    }

    get spells() { return this._spells; }

    // Sobrescreve o método attack
    attack() {
        if (!this._isAlive()) return 0;

        if (this._spells > 0) {
            this._spells--; // Gasta feitiço
            
            // Lógica de restauração se zerar
            if (this._spells === 0) {
                this.scheduleRecharge();
            }
            
            return this._damage; // Retorna dano (3)
        } else {
            return 0; // Sem feitiços
        }
    }

    scheduleRecharge() {
        // Log para o usuário saber que vai recarregar
        if(this.onUpdateUI) this.onUpdateUI("⚠️ Feitiços esgotados! Recarregando em 10s...");

        setTimeout(() => {
            if (this._isAlive()) {
                this._spells = 10; // Restaura
                if(this.onUpdateUI) this.onUpdateUI("✨ Feitiços restaurados!");
            }
        }, 10000); // 10 segundos
    }
}

// ==========================================
// LÓGICA DE INTERFACE (DOM)
// ==========================================

let player = null; // Variável global para armazenar a instância atual

// Elementos
const logEl = document.getElementById('log');
const avatarEl = document.getElementById('avatarPiece');
const gameArea = document.getElementById('gameArea');
const statAmmo = document.getElementById('statAmmo');
const statSpells = document.getElementById('statSpells');
const btnAddAmmo = document.getElementById('btnAddAmmo');

// Função de iniciar jogo
document.getElementById('btnStartGame').addEventListener('click', () => {
    const type = document.getElementById('charType').value;
    
    // Função auxiliar para o Mago atualizar a UI via callback
    const uiCallback = (msg) => {
        logEl.textContent = msg;
        updateUI();
    };

    if (type === 'cowboy') {
        player = new Cowboy(0, 0);
        avatarEl.className = 'avatar-piece cowboy';
    } else if (type === 'mago') {
        player = new Mago(0, 0, uiCallback);
        avatarEl.className = 'avatar-piece mago';
    } else {
        player = new Avatar(0, 0);
        avatarEl.className = 'avatar-piece avatar-default';
    }

    // Configura visibilidade dos painéis
    gameArea.classList.remove('hidden');
    
    // Mostra/Esconde elementos específicos
    if (player instanceof Cowboy) {
        statAmmo.classList.remove('hidden');
        btnAddAmmo.classList.remove('hidden');
        statSpells.classList.add('hidden');
    } else if (player instanceof Mago) {
        statSpells.classList.remove('hidden');
        statAmmo.classList.add('hidden');
        btnAddAmmo.classList.add('hidden');
    } else {
        statAmmo.classList.add('hidden');
        statSpells.classList.add('hidden');
        btnAddAmmo.classList.add('hidden');
    }

    logEl.textContent = `Jogo iniciado com: ${type.toUpperCase()}`;
    updateUI();
});

// Atualiza valores na tela
function updateUI(msg) {
    if (!player) return;

    document.getElementById('displayHp').textContent = player.hp;
    document.getElementById('displayCoins').textContent = player.coins;
    document.getElementById('displayDmg').textContent = player.damage;
    document.getElementById('displayPos').textContent = `${player.x}, ${player.y}`;
    
    // Atualiza Stats Específicos se existirem
    if (player instanceof Cowboy) {
        document.getElementById('displayAmmo').textContent = player.ammo;
    }
    if (player instanceof Mago) {
        document.getElementById('displaySpells').textContent = player.spells;
    }

    // Atualiza Visual
    const visualX = Math.min(player.x * 20, 360);
    const visualY = Math.min(player.y * 20, 130);
    avatarEl.style.left = `${visualX}px`;
    avatarEl.style.bottom = `${visualY}px`;

    if (player.hp <= 0) {
        avatarEl.classList.add('dead');
        logEl.textContent = "☠️ Você morreu!";
    } else if (msg) {
        logEl.textContent = msg;
    }
}

// --- Event Listeners Genéricos ---

document.getElementById('btnForward').addEventListener('click', () => { player && player.forward(); updateUI(); });
document.getElementById('btnBack').addEventListener('click', () => { player && player.back(); updateUI(); });
document.getElementById('btnLeft').addEventListener('click', () => { player && player.left(); updateUI(); });
document.getElementById('btnRight').addEventListener('click', () => { player && player.right(); updateUI(); });

document.getElementById('btnCoin').addEventListener('click', () => { 
    if(player && player.addCoin()) updateUI("Moeda coletada!"); 
});

document.getElementById('btnDamage').addEventListener('click', () => { 
    if(player) {
        player.takeDamage(2);
        updateUI("Você sofreu dano!"); 
    }
});

// Botão de Ataque (comporta-se diferente por classe)
document.getElementById('btnAttack').addEventListener('click', () => {
    if (!player) return;

    const dmg = player.attack();

    if (player.hp <= 0) {
        updateUI("Morto não ataca.");
        return;
    }

    if (dmg > 0) {
        updateUI(`Ataque realizado! Dano: ${dmg}`);
    } else {
        // Se retornou 0 e está vivo, é porque acabou o recurso
        if (player instanceof Cowboy) {
            updateUI("Clic... sem munição!");
        } else if (player instanceof Mago) {
            updateUI("Sem energia mágica... aguarde recarga.");
        }
    }
});

// Botão exclusivo do Cowboy
btnAddAmmo.addEventListener('click', () => {
    if (player instanceof Cowboy) {
        player.addAmmo();
        updateUI("Recarregou +1 bala.");
    }
});