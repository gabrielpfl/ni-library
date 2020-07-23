import { InjectionToken } from '@angular/core';

import { Image } from './ni-image-box.service'

export const IMAGE_BOX_DATA = new InjectionToken<Image>('IMAGE_BOX_DATA')