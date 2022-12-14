package kg.eld.zamenapinnerbot;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.objects.Update;

@RestController
@CrossOrigin(origins = "*", originPatterns = "*")
@RequiredArgsConstructor
public class TelegramController {

	private final ZamenaPinnerBot bot;
	private final ZamenaService zamenaService;

	@PostMapping
	BotApiMethod<?> onUpdateReceived(@RequestBody Update update) {
		return bot.onWebhookUpdateReceived(update);
	}

	@PostMapping("/zamena")
	ResponseEntity<String> onZamenaReceived(
			@RequestBody ZamenaSnapshot snapshot) {
		zamenaService.processZamena(snapshot);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
