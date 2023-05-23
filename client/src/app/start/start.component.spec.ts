import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { StartComponent } from './start.component';
import { Router } from '@angular/router';

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [StartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    expect(titleElement.textContent).toContain('Cross Game');
  });

  it('should display the Play Now button', () => {
    const buttonElement = fixture.nativeElement.querySelector('button[routerLink="/game"]');
    expect(buttonElement).toBeTruthy();
  });

  it('should navigate to "/game" on button click', inject([Router], (router: Router) => {
    spyOn(router, 'navigateByUrl');
    const buttonElement = fixture.debugElement.query(By.css('button[routerLink="/game"]')).nativeElement;
    buttonElement.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/game');
  }));

  it('should display the start image', () => {
    const imageElement = fixture.nativeElement.querySelector('img');
    expect(imageElement).toBeTruthy();
    expect(imageElement.src).toContain('../../assets/images/start_image.png');
  });

  it('should display the level paragraph', () => {
    const levelElement = fixture.nativeElement.querySelector('.level');
    expect(levelElement).toBeTruthy();
    expect(levelElement.textContent).toContain('Your Level');
  });

  it('should display the progress bar', () => {
    const progressbarElement = fixture.nativeElement.querySelector('.progressbar');
    expect(progressbarElement).toBeTruthy();
    
    const progressbarItems = progressbarElement.querySelectorAll('li');
    expect(progressbarItems.length).toBe(4);
  });
});
