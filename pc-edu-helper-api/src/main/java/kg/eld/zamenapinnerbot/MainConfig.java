package kg.eld.zamenapinnerbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.api.methods.updates.SetWebhook;


@Configuration
public class MainConfig {
	
	@Value("${telegram.webhook-path}")
    private String webhookPath;

    /*
     * Зарегистрировать вебхук:
     * https://api.telegram.org/bot<токен бота>/setWebhook?url=<url на которую будут приходить update>
     * 
     * Получение инфо об вебхуках данного бота
     * https://api.telegram.org/bot<токен бота>/getWebhookInfo
     */
    @Bean
    SetWebhook setWebhookInstance() {
        return SetWebhook.builder().url(webhookPath).build();
    }
}
