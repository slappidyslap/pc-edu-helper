package kg.eld.zamenapinnerbot.controller;

import kg.eld.zamenapinnerbot.service.ZamenaService;
import kg.eld.zamenapinnerbot.model.ZamenaSnapshot;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(originPatterns = "*")
@RequiredArgsConstructor
public class TelegramController {

	private final ZamenaService zamenaService;

	@PostMapping("/zamena")
	ResponseEntity<String> onZamenaReceived(
			@RequestBody ZamenaSnapshot snapshot) {
		zamenaService.processZamena(snapshot);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
