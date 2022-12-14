package kg.eld.zamenapinnerbot;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/documents/zamena")
    ResponseEntity<Resource> createZamenaDocument(
            @RequestBody ZamenaSnapshot snapshot
    ) {
        Resource resource = documentService.createZamenaDocument(snapshot);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @PostMapping("/documents/time-table")
    ResponseEntity<Resource> createTimeTableDocument(
            @RequestBody TimeTableSnapshot snapshot
    ) {
        Resource resource = documentService.createTimeTableDocument(snapshot);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
