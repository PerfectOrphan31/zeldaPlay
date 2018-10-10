import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Note } from 'entities/note.entity';

import { NoteDTO } from './interfaces/note.dto';
import { NoteService } from './note.service';

@ApiUseTags('note')
@Controller('characters/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get(':charId')
  @ApiOperation({
    title: 'Get Notes',
    description: 'Get all the notes of one character.'
  })
  async getNotes(@Param('charId') charId: string): Promise<Note[]> {
    return this.noteService.getNotes(charId);
  }

  @Post(':charId')
  @ApiOperation({
    title: 'New Note',
    description: 'Make a new note tied to this character.'
  })
  async newNote(
    @Body() inNote: NoteDTO,
    @Param('charId') charId: string
  ): Promise<Note> {
    return this.noteService.saveNote(inNote, charId);
  }
}