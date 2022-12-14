package kg.eld.zamenapinnerbot;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.pinnedmessages.PinChatMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ZamenaService {

    private final ZamenaPinnerBot bot;
    private final ChatRepository chatRepository;
    private final DocumentService documentService;

    public void processZamena(ZamenaSnapshot snapshot) {

        Resource resource = documentService.createZamenaDocument(snapshot);

        for (Chat chat : chatRepository.findAll()) {
            try {
                SendDocument sendDocument = SendDocument
                        .builder()
                        .chatId(chat.getId())
                        .document(new InputFile(
                                resource.getInputStream(),
                                snapshot.getName() + ".pdf"))
                        .build();

                Message sentDocumentMessage = bot.execute(sendDocument);

                PinChatMessage pinChatMessage = PinChatMessage.builder()
                        .chatId(chat.getId())
                        .messageId(sentDocumentMessage.getMessageId())
                        .build();
                bot.execute(pinChatMessage);
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (TelegramApiException e) {
                continue;
                /*try {
                    bot.execute(SendMessage
                            .builder()
                            .chatId(chat.getId())
                            .text("Напоминаю, что я не админ")
                            .build());
                } catch (TelegramApiException ex) {
                    throw new RuntimeException(ex);
                }*/
            }
        }
    }
}
