const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// -- LÓGICA DE DEFINIR VENCEDOR (!sw) --
async function handleVictory(winner, loser, isWO) {
    if (isWO) {
        // Lógica de W.O. -> Nenhuma stat alterada
        return "⚠️ Partida encerrada por W.O. (Resultado Inválido). Nenhuma estatística foi contabilizada.";
    }

    // -- LÓGICA DE VITÓRIA REAL --
    // 1. Incrementar Vitórias/Derrotas
    winner.wins += 1;
    loser.losses += 1;
    
    // 2. Incrementar Sequência
    winner.streak += 1;
    loser.streak = 0; // Resetar perdedor

    // 3. Lógica de ORCA COINS (2 vitórias = 1 coin)
    winner.contadorCoins += 1;
    if (winner.contadorCoins >= 2) {
        winner.coins += 1;
        winner.contadorCoins = 0; // Resetar contador
        // Enviar DM para o jogador
    }
    
    await winner.save();
    await loser.save();
    return "Vitória computada com sucesso! <a:winmoney:1513998357583102073>";
}

// -- COMANDO !wins (Auditoria Privada) --
client.on('messageCreate', async (message) => {
    if (message.content === '!wins') {
        const userData = await Database.get(message.author.id); // Simulação
        const embed = new EmbedBuilder()
            .setTitle("📊 Auditoria de Vitórias - ORCA APOSTAS")
            .setDescription(`⚔️ **Total de Vitórias:** ${userData.wins} <a:winmoney:1513998357583102073>\n` +
                            `🔥 **Vitórias Consecutivas:** ${userData.streak}\n` +
                            `🪙 **Contador para Coin:** ${userData.contadorCoins} / 2`);
        
        await message.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(process.env.TOKEN);
