package kg.eld.zamenapinnerbot.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import kg.eld.zamenapinnerbot.model.Lesson;
import kg.eld.zamenapinnerbot.model.TimeTableSnapshot;
import kg.eld.zamenapinnerbot.model.ZamenaSnapshot;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Service
@Log4j2
public class DocumentService {

    private static final BaseFont baseFont;
    private static final BaseColor borderColor = new BaseColor(157, 22, 22);

    static {
        try {
            ClassLoader classLoader = DocumentService.class.getClassLoader();
            byte[] fontBytes = IOUtils.toByteArray(
                    Objects.requireNonNull(
                            classLoader.getResourceAsStream("times-new-roman.ttf"),
                            "Шрифт не найден"));
            baseFont = BaseFont.createFont(
                    "times-new-roman.ttf",
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    true,
                    fontBytes,
                    null
            );
        } catch (IOException | DocumentException e) {
            throw new RuntimeException(e);
        }
    }


    public Resource createZamenaDocument(ZamenaSnapshot snapshot) {

        return documentDecorator(snapshot.getName(), (document) -> {

            Map<String, Map<String, List<Lesson>>> json = snapshot.getData();

            PdfPTable table = new PdfPTable(new float[]{1, 6, 6, 2});
            for (String groupName : json.keySet()) {
                table.addCell(getGroupCell(groupName, true));
                for (String lessonNum : json.get(groupName).keySet())
                    for (Lesson lesson : json.get(groupName).get(lessonNum)) {
                        table.addCell(formatLessonNum(lessonNum));
                        table.addCell(formatTextForZamena(lesson.getSubject()));
                        table.addCell(formatTextForZamena(lesson.getTeacher()));
                        table.addCell(formatTextForZamena(lesson.getAudience()));
                    }
            }
            return table;
        });
    }

    public Resource createTimeTableDocument(TimeTableSnapshot snapshot) {
        return documentDecorator(snapshot.getName(), (document) -> {

            Map<String, Map<String, Map<String, List<Lesson>>>> json = snapshot.getData();
            PdfPTable outerTable = new PdfPTable(new float[]{1, 1});
            outerTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            for (String groupName : json.keySet()) {
                PdfPTable table = new PdfPTable(new float[]{10, 90});
                PdfPCell groupCell = getGroupCell(groupName, false);
                table.addCell(groupCell);

                for (int weekNum = 0; weekNum < 5; weekNum++) {
                    table.addCell(formatWeekNameByNum(weekNum)); // 1 col
                    PdfPTable innerTable = new PdfPTable(new float[]{5, 95});
//                    innerTable.setWidthPercentage(100);

                    for (int lessonNum = 0; lessonNum < 7; lessonNum++) {
                        innerTable.addCell(formatLessonNum(str(lessonNum)));
                        PdfPTable lessonsRow = new PdfPTable(1);

                        Map<String, List<Lesson>> map = json.get(groupName).get(str(weekNum));
                        if (map != null && map.get(str(lessonNum)) != null) {
                            for (Lesson lesson : map.get(str(lessonNum))) {
                                PdfPCell cell = formatTextForTimeTable(lesson);
                                lessonsRow.addCell(cell); // 1 col
                            }
                        }
                        PdfPCell innerTableCell = new PdfPCell(lessonsRow);
                        innerTableCell.setBorderColor(borderColor);

                        innerTable.addCell(innerTableCell);
                    }
                    PdfPCell tableCell = new PdfPCell(innerTable);
                    tableCell.setBorderColor(borderColor);
                    tableCell.setPadding(0);
                    table.addCell(tableCell);
                }
                table.setWidthPercentage(table.getWidthPercentage() - 10);
                PdfPCell outerTableCell = new PdfPCell(table);
                outerTableCell.setBorderColor(borderColor);
                outerTable.addCell(outerTableCell); // 2 col
            }
            outerTable.completeRow();
            return outerTable;
        });
    }

    private String str(int i) {
        return Integer.toString(i);
    }

    private PdfPCell formatWeekNameByNum(int num) {
        String weekName;
        if (num == 0) weekName = "Понедельник";
        else if (num == 1) weekName = "Вторник";
        else if (num == 2) weekName = "Среда";
        else if (num == 3) weekName = "Четверг";
        else weekName = "Пятница";
        PdfPCell cell = new PdfPCell();
        cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
        cell.setRotation(90);
        cell.setUseAscender(true);
        cell.setBorderColor(borderColor);
        Chunk chunk = new Chunk(weekName);
        chunk.setFont(new Font(baseFont, 12, Font.BOLD));

        Paragraph paragraph = new Paragraph(chunk);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);

        cell.addElement(paragraph);
        return cell;
    }

    private PdfPCell formatLessonNum(String lessonNum) {
        String lessonNumStr = Integer.toString(Integer.parseInt(lessonNum) + 1);
        PdfPCell cell = new PdfPCell();
        cell.setUseAscender(true);
        cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
        cell.setBorderColor(borderColor);
        Paragraph paragraph = getTextCenteredParagraph(lessonNumStr, true, 10);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        cell.addElement(paragraph);
        return cell;
    }

    private Resource documentDecorator(String title, Function<Document, Element> function) {
        if (title == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "the title is null");
        }
        boolean isZamena = title.contains("ЗАМЕНА");
        if (isZamena)
            log.info("Пришел новый снимок замены");
        else
            log.info("Пришел новый снимок расписания");

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, -15, -15, 15, 15);
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(getTitleParagraph(title));
            addSpacing(document);
            Element element;
            try {
                element = function.apply(document);
            } catch (NullPointerException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            }
            document.add(element);

            document.close();

            if (isZamena)
                log.info("Новый снимок замены обработан: Размер: {}", formatResultDocumentSize(out.size()));
            else
                log.info("Новый снимок расписания обработан: Размер: {}", formatResultDocumentSize(out.size()));

            return new ByteArrayResource(out.toByteArray());
        } catch (IOException | DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private void addSpacing(Document document) {
        try {
            document.add(new Paragraph(" "));
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    private String formatResultDocumentSize(int sizeInBytes) {
        return new DecimalFormat("#0.00").format(sizeInBytes / 1024.0) + "КБ";
    }

    private PdfPCell formatTextForZamena(String inputText) {
        PdfPCell cell = new PdfPCell();
        cell.setUseAscender(true);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.addElement(getTextCenteredParagraph(inputText, false, -1));
        cell.setBorderColor(borderColor);
        return cell;
    }

    private PdfPCell formatTextForTimeTable(Lesson lesson) {
        try {
            PdfPCell cell = new PdfPCell();
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setUseAscender(true);
            cell.setPaddingBottom(5);
            cell.setPaddingTop(5);
            cell.setBorderColor(borderColor);
            if (lesson.getType().equals("black")) cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            Chunk chunk = new Chunk(lesson.toString().trim());
            chunk.setFont(new Font(baseFont, 11));
            Paragraph paragraph = new Paragraph(chunk);
            paragraph.setIndentationLeft(3);
            cell.addElement(paragraph);
            return cell;
        } catch (Exception e) { //
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    private Paragraph getTextCenteredParagraph(String inputText, boolean isToSetBold, int fontSize) {
        Chunk chunk = new Chunk(inputText);
        chunk.setFont(new Font(
                baseFont,
                fontSize != -1 ? fontSize : 12,
                isToSetBold ? Font.BOLD : Font.NORMAL));
        Paragraph paragraph = new Paragraph(chunk);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        return paragraph;
    }

    private PdfPCell getGroupCell(String groupName, boolean isZamena) {
        Chunk chunk = new Chunk(groupName);
        chunk.setFont(new Font(baseFont, 12, Font.BOLD));
        Paragraph paragraph = new Paragraph(chunk);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        PdfPCell cell = new PdfPCell();
        cell.setUseAscender(true);
        cell.setColspan(isZamena ? 4 : 2);
        cell.addElement(paragraph);
        cell.setBorderColor(borderColor);
        return cell;
    }

    private Paragraph getTitleParagraph(String inputText) {
        return getTextCenteredParagraph(
                inputText, true, 20);
    }
}
