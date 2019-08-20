import { CategoriasService } from './../../categorias/shared/categorias.service';
import { Observable } from 'rxjs';
import { ProdutosService } from '../shared/produtos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';




@ Component({
  selector: 'app-form-produtos',
  templateUrl: './form-produtos.component.html',
  styleUrls: ['./form-produtos.component.scss']
})
export class FormProdutosComponent implements OnInit {
  formProduto: FormGroup;
  key:string;
  categorias: Observable<any[]>;

  private file:File=null;
  imgUrl: string='';
  filePatch: string='';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private CategoriasService: CategoriasService,
              private produtosService: ProdutosService,
              private toastr: ToastrService,
              private router: Router

  ) { }

  ngOnInit() {
    this .criarFormulario();
    this.categorias=this.CategoriasService.getAll();

    this .key = this .route.snapshot.paramMap.get('key');
        if(this .key){

          const produtoSubscribe = this .produtosService.getByKey(this .key)
          .subscribe((produtos:any) => {

            produtoSubscribe.unsubscribe();
            this .formProduto.setValue({
              nome: produtos.nome,
              descricao: produtos.descricao,
              preco: produtos.preco,
              categoriaKey: produtos.categoriaKey,
              categoriaNome: produtos.categoriaNome,
            });

            this.imgUrl = produtos.img || '';
            this.filePatch = produtos.filePatch || '';
          });
        }
      }

      get nome(){ return this .formProduto.get('nome'); }
      get descricao() { return this .formProduto.get('descricao'); }
      get categoriaKey() { return this .formProduto.get('categoriaKey'); }
      get categoriaNome() { return this .formProduto.get('categoriaNome'); }


    criarFormulario() {
      this .key = null;
      this .formProduto = this .formBuilder.group({
        nome: ['', Validators.required],
        descricao: [''],
        preco: [''],
        categoriaKey:['', Validators.required],
        categoriaNome:[''],
        img:['']
      });

      this.file =null;
      this.imgUrl='';
      this.filePatch='';
  }

    setCategoriasNome(categorias: any){
      if(categorias && this.formProduto.value.categoriaKey){
        const categoriaNome = categorias[0].text;
        this.categoriaNome.setValue(categoriaNome);
      }else{
        this.categoriaNome.setValue('');
      }
    }

    upload(event: any){
      if(event.target.files.length){
        this.file=event.target.files[0];
      }else{
        this.file=null;
      }
    }

    removeImg(){
      this.produtosService.removeImg(this.filePatch, this.key);
      this.imgUrl='';
      this.filePatch='';
    }


  onSubmit(){
    if(this .formProduto.valid) {
      if(this .key) {
      this .produtosService.update(this .formProduto.value, this .key);
      } else {
        this .produtosService.insert(this .formProduto.value);
      }
       this .router.navigate(['produtos']);
      this .toastr.success('Produto salvo com sucesso!!!');
    }
  }



}
