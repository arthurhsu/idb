@Component({
  selector: 'scrum'
})

@Template({
  inline: '<h1>Hello {{name}}</h1>'
})

class MyApp {
  constructor() {
    this.name = 'Alice';
  }
}

bootstrap(MyApp);
