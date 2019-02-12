import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { DbNote } from '@Db/models/db_note.model';
import { NoteDTO } from '@Models/note/note.dto';

@Injectable()
export class NotePipe implements PipeTransform<NoteDTO, DbNote> {
  transform(value: NoteDTO, metadata: ArgumentMetadata): DbNote {
    const note = new DbNote();
    note.nMessage = value.msg;
    note.nNoteTime = value.time as any;
    note.nId = value.id;
    note.nImportant = value.important;
    return note;
  }
}
