import { TestBed } from '@angular/core/testing';

import { EmocionesService } from './emociones.service';

describe('EmocionesService', () => {
  let service: EmocionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmocionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
