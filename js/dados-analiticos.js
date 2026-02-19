class PainelEstatisticas {
    constructor() {
        // Pontos de montagem da interface
        this.rootFilters = document.getElementById('filtros-estatisticas');
        this.rootKpis = document.getElementById('kpis-estatisticas');
        this.rootTipos = document.getElementById('ranking-tipos');
        this.rootEstados = document.getElementById('ranking-estados');
        this.rootCidades = document.getElementById('ranking-cidades');
        this.rootTableHead = document.getElementById('tabela-estatisticas-head');
        this.rootTableBody = document.getElementById('tabela-estatisticas-body');
        this.rootTableSummary = document.getElementById('tabela-resumo');
        this.rootPagination = document.getElementById('tabela-paginacao');

        if (!this.rootFilters || !this.rootTableBody) return;

        // Fonte local de dados (pode ser substituída por API no futuro)
        this.rawData = this.buildLocalDataset();

        // Estado da aplicação
        this.state = {
            filters: {
                ano: 'todos',
                uf: 'todos',
                cidade: 'todos',
                tipo: 'todos',
                municipio: ''
            },
            sort: {
                key: 'ano',
                direction: 'desc' // asc | desc
            },
            pagination: {
                page: 1,
                pageSize: 12
            }
        };

        // Mapeamento das colunas ordenáveis
        this.columns = [
            { key: 'ano', label: 'Ano', sortable: true },
            { key: 'uf', label: 'UF', sortable: true },
            { key: 'cidade', label: 'Cidade', sortable: true },
            { key: 'municipio', label: 'Município', sortable: true },
            { key: 'tipo', label: 'Tipo', sortable: true },
            { key: 'casos', label: 'Casos', sortable: true },
            { key: 'denuncias', label: 'Denúncias', sortable: true }
        ];

        this.renderFilterControls();
        this.renderTableHead();
        this.refresh();
    }

    // ---------------------------
    // Dataset local (simulado)
    // ---------------------------
    buildLocalDataset() {
        const anos = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const tipos = ['Física', 'Psicológica', 'Sexual', 'Patrimonial', 'Moral'];

        const brasil = {
            AC: { cidade: 'Rio Branco', municipios: ['Rio Branco', 'Cruzeiro do Sul'] },
            AL: { cidade: 'Maceió', municipios: ['Maceió', 'Arapiraca'] },
            AP: { cidade: 'Macapá', municipios: ['Macapá', 'Santana'] },
            AM: { cidade: 'Manaus', municipios: ['Manaus', 'Parintins'] },
            BA: { cidade: 'Salvador', municipios: ['Salvador', 'Feira de Santana'] },
            CE: { cidade: 'Fortaleza', municipios: ['Fortaleza', 'Caucaia'] },
            DF: { cidade: 'Brasília', municipios: ['Plano Piloto', 'Ceilândia'] },
            ES: { cidade: 'Vitória', municipios: ['Vitória', 'Vila Velha'] },
            GO: { cidade: 'Goiânia', municipios: ['Goiânia', 'Aparecida de Goiânia'] },
            MA: { cidade: 'São Luís', municipios: ['São Luís', 'Imperatriz'] },
            MT: { cidade: 'Cuiabá', municipios: ['Cuiabá', 'Rondonópolis'] },
            MS: { cidade: 'Campo Grande', municipios: ['Campo Grande', 'Dourados'] },
            MG: { cidade: 'Belo Horizonte', municipios: ['Belo Horizonte', 'Uberlândia'] },
            PA: { cidade: 'Belém', municipios: ['Belém', 'Ananindeua'] },
            PB: { cidade: 'João Pessoa', municipios: ['João Pessoa', 'Campina Grande'] },
            PR: { cidade: 'Curitiba', municipios: ['Curitiba', 'Londrina'] },
            PE: { cidade: 'Recife', municipios: ['Recife', 'Jaboatão dos Guararapes'] },
            PI: { cidade: 'Teresina', municipios: ['Teresina', 'Parnaíba'] },
            RJ: { cidade: 'Rio de Janeiro', municipios: ['Rio de Janeiro', 'São Gonçalo'] },
            RN: { cidade: 'Natal', municipios: ['Natal', 'Mossoró'] },
            RS: { cidade: 'Porto Alegre', municipios: ['Porto Alegre', 'Caxias do Sul'] },
            RO: { cidade: 'Porto Velho', municipios: ['Porto Velho', 'Ji-Paraná'] },
            RR: { cidade: 'Boa Vista', municipios: ['Boa Vista', 'Rorainópolis'] },
            SC: { cidade: 'Florianópolis', municipios: ['Florianópolis', 'Joinville'] },
            SP: { cidade: 'São Paulo', municipios: ['São Paulo', 'Campinas'] },
            SE: { cidade: 'Aracaju', municipios: ['Aracaju', 'Nossa Senhora do Socorro'] },
            TO: { cidade: 'Palmas', municipios: ['Palmas', 'Araguaína'] }
        };

        const pesoTipo = {
            Física: 1.12,
            Psicológica: 1.31,
            Sexual: 0.74,
            Patrimonial: 0.62,
            Moral: 0.90
        };

        const ufs = Object.keys(brasil);
        const data = [];

        anos.forEach((ano, idxAno) => {
            ufs.forEach((uf, idxUf) => {
                const estado = brasil[uf];
                estado.municipios.forEach((municipio, idxMun) => {
                    tipos.forEach((tipo, idxTipo) => {
                        const base = 72 + (idxAno * 10) + ((idxUf % 11) * 6) + (idxMun * 8) + (idxTipo * 4);
                        const casos = Math.max(8, Math.round(base * pesoTipo[tipo]));
                        const denuncias = Math.max(4, Math.round(casos * (0.70 + idxTipo * 0.04)));

                        data.push({
                            ano,
                            uf,
                            cidade: estado.cidade,
                            municipio,
                            tipo,
                            casos,
                            denuncias
                        });
                    });
                });
            });
        });

        return data;
    }

    // ---------------------------
    // Utilidades
    // ---------------------------
    formatNum(value) {
        return new Intl.NumberFormat('pt-BR').format(Number(value) || 0);
    }

    uniqueValues(field, rows = this.rawData) {
        return [...new Set(rows.map(row => row[field]))].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));
    }

    groupSum(rows, groupField, sumField) {
        const map = new Map();
        rows.forEach(row => {
            map.set(row[groupField], (map.get(row[groupField]) || 0) + row[sumField]);
        });

        return [...map.entries()]
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    }

    // ---------------------------
    // Filtros
    // ---------------------------
    renderFilterControls() {
        this.rootFilters.innerHTML = '';

        const controls = [
            this.createSelectControl('Ano', 'ano', ['todos', ...this.uniqueValues('ano')]),
            this.createSelectControl('Estado (UF)', 'uf', ['todos', ...this.uniqueValues('uf')]),
            this.createSelectControl('Cidade', 'cidade', ['todos', ...this.uniqueValues('cidade')]),
            this.createSelectControl('Tipo de Violência', 'tipo', ['todos', ...this.uniqueValues('tipo')]),
            this.createInputControl('Município', 'municipio')
        ];

        controls.forEach(control => this.rootFilters.appendChild(control));
    }

    createSelectControl(labelText, key, options) {
        const wrap = document.createElement('div');
        wrap.className = 'filtro-grupo';

        const label = document.createElement('label');
        label.setAttribute('for', `filtro-${key}`);
        label.textContent = labelText;

        const select = document.createElement('select');
        select.id = `filtro-${key}`;

        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = String(optionValue);
            option.textContent = optionValue === 'todos' ? 'Todos' : String(optionValue);
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            this.state.filters[key] = select.value;

            // Atualiza opções dependentes para evitar combinações inválidas
            if (key === 'uf') this.syncCidadeOptions();

            // Reatividade total: tudo atualiza sem reload
            this.state.pagination.page = 1;
            this.refresh();
        });

        wrap.append(label, select);
        return wrap;
    }

    createInputControl(labelText, key) {
        const wrap = document.createElement('div');
        wrap.className = 'filtro-grupo';

        const label = document.createElement('label');
        label.setAttribute('for', `filtro-${key}`);
        label.textContent = labelText;

        const input = document.createElement('input');
        input.id = `filtro-${key}`;
        input.type = 'text';
        input.placeholder = 'Digite para filtrar';

        input.addEventListener('input', () => {
            this.state.filters[key] = input.value.trim().toLowerCase();
            this.state.pagination.page = 1;
            this.refresh();
        });

        wrap.append(label, input);
        return wrap;
    }

    syncCidadeOptions() {
        const cidadeSelect = document.getElementById('filtro-cidade');
        if (!cidadeSelect) return;

        const { uf, ano, tipo, municipio } = this.state.filters;

        const base = this.rawData.filter(row => {
            if (uf !== 'todos' && row.uf !== uf) return false;
            if (ano !== 'todos' && String(row.ano) !== String(ano)) return false;
            if (tipo !== 'todos' && row.tipo !== tipo) return false;
            if (municipio && !row.municipio.toLowerCase().includes(municipio)) return false;
            return true;
        });

        const cities = ['todos', ...this.uniqueValues('cidade', base)];

        if (!cities.includes(this.state.filters.cidade)) {
            this.state.filters.cidade = 'todos';
        }

        cidadeSelect.innerHTML = cities
            .map(city => `<option value="${city}">${city === 'todos' ? 'Todos' : city}</option>`)
            .join('');

        cidadeSelect.value = this.state.filters.cidade;
    }

    applyFilters() {
        const { ano, uf, cidade, tipo, municipio } = this.state.filters;

        return this.rawData.filter(row => {
            if (ano !== 'todos' && String(row.ano) !== String(ano)) return false;
            if (uf !== 'todos' && row.uf !== uf) return false;
            if (cidade !== 'todos' && row.cidade !== cidade) return false;
            if (tipo !== 'todos' && row.tipo !== tipo) return false;
            if (municipio && !row.municipio.toLowerCase().includes(municipio)) return false;
            return true;
        });
    }

    // ---------------------------
    // Métricas
    // ---------------------------
    calculateIndicators(rows) {
        const totalCasos = rows.reduce((sum, row) => sum + row.casos, 0);
        const totalDenuncias = rows.reduce((sum, row) => sum + row.denuncias, 0);

        const totalAnos = new Set(rows.map(row => row.ano)).size;
        const mediaAnual = totalAnos > 0 ? Math.round(totalCasos / totalAnos) : 0;

        const taxa = totalCasos > 0 ? (totalDenuncias / totalCasos) * 100 : 0;

        return {
            totalCasos,
            totalDenuncias,
            mediaAnual,
            taxa
        };
    }

    // ---------------------------
    // Tabela: ordenação e paginação
    // ---------------------------
    sortRows(rows) {
        const { key, direction } = this.state.sort;
        const sorted = [...rows].sort((a, b) => {
            const v1 = a[key];
            const v2 = b[key];

            if (typeof v1 === 'number' && typeof v2 === 'number') {
                return direction === 'asc' ? v1 - v2 : v2 - v1;
            }

            const comp = String(v1).localeCompare(String(v2), 'pt-BR');
            return direction === 'asc' ? comp : -comp;
        });

        return sorted;
    }

    paginateRows(rows) {
        const { page, pageSize } = this.state.pagination;
        const totalItems = rows.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const safePage = Math.min(Math.max(1, page), totalPages);

        this.state.pagination.page = safePage;

        const start = (safePage - 1) * pageSize;
        const end = start + pageSize;

        return {
            rows: rows.slice(start, end),
            totalItems,
            totalPages,
            page: safePage
        };
    }

    // ---------------------------
    // Render
    // ---------------------------
    renderIndicators(indicators) {
        this.rootKpis.innerHTML = `
            <article class="kpi-estatistica"><strong>${this.formatNum(indicators.totalCasos)}</strong><span>Total de casos</span></article>
            <article class="kpi-estatistica"><strong>${this.formatNum(indicators.totalDenuncias)}</strong><span>Total de denúncias</span></article>
            <article class="kpi-estatistica"><strong>${this.formatNum(indicators.mediaAnual)}</strong><span>Média anual de casos</span></article>
            <article class="kpi-estatistica"><strong>${indicators.taxa.toFixed(1)}%</strong><span>Taxa denúncias/casos</span></article>
        `;
    }

    renderRanking(root, items, subtitle) {
        if (!items.length) {
            root.innerHTML = '<p class="tabela-vazia">Sem dados para os filtros selecionados.</p>';
            return;
        }

        root.innerHTML = items.slice(0, 10).map(item => `
            <div class="ranking-item">
                <div>
                    <strong>${item.label}</strong>
                    <small>${subtitle}</small>
                </div>
                <strong>${this.formatNum(item.value)}</strong>
            </div>
        `).join('');
    }

    renderTableHead() {
        this.rootTableHead.innerHTML = `
            <tr>
                ${this.columns.map(col => {
                    if (!col.sortable) return `<th>${col.label}</th>`;
                    const isActive = this.state.sort.key === col.key;
                    const arrow = isActive ? (this.state.sort.direction === 'asc' ? '▲' : '▼') : '↕';

                    return `
                        <th>
                            <button type="button" class="th-sort-btn ${isActive ? 'is-active' : ''}" data-sort-key="${col.key}" aria-label="Ordenar por ${col.label}">
                                ${col.label} <span>${arrow}</span>
                            </button>
                        </th>
                    `;
                }).join('')}
            </tr>
        `;

        this.rootTableHead.querySelectorAll('[data-sort-key]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-sort-key');
                if (!key) return;

                if (this.state.sort.key === key) {
                    this.state.sort.direction = this.state.sort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    this.state.sort.key = key;
                    this.state.sort.direction = 'asc';
                }

                this.state.pagination.page = 1;
                this.refresh();
            });
        });
    }

    renderTable(rowsPage, totalItems) {
        this.rootTableSummary.innerHTML = `Exibindo <strong>${this.formatNum(totalItems)}</strong> registros após filtros.`;

        if (!rowsPage.length) {
            this.rootTableBody.innerHTML = '<tr><td colspan="7" class="tabela-vazia">Nenhum registro encontrado para os filtros aplicados.</td></tr>';
            return;
        }

        this.rootTableBody.innerHTML = rowsPage.map(row => `
            <tr>
                <td>${row.ano}</td>
                <td>${row.uf}</td>
                <td>${row.cidade}</td>
                <td>${row.municipio}</td>
                <td>${row.tipo}</td>
                <td>${this.formatNum(row.casos)}</td>
                <td>${this.formatNum(row.denuncias)}</td>
            </tr>
        `).join('');
    }

    renderPagination(meta) {
        const { page, totalPages, totalItems } = meta;

        if (totalItems === 0) {
            this.rootPagination.innerHTML = '';
            return;
        }

        this.rootPagination.innerHTML = `
            <button type="button" class="btn-paginacao" data-page-action="prev" ${page <= 1 ? 'disabled' : ''}>Anterior</button>
            <span class="paginacao-info">Página ${page} de ${totalPages}</span>
            <button type="button" class="btn-paginacao" data-page-action="next" ${page >= totalPages ? 'disabled' : ''}>Próxima</button>
            <label class="paginacao-size-label" for="paginacao-size">Linhas por página</label>
            <select id="paginacao-size" class="paginacao-size-select">
                ${[8, 12, 20, 30].map(size => `<option value="${size}" ${this.state.pagination.pageSize === size ? 'selected' : ''}>${size}</option>`).join('')}
            </select>
        `;

        const prevBtn = this.rootPagination.querySelector('[data-page-action="prev"]');
        const nextBtn = this.rootPagination.querySelector('[data-page-action="next"]');
        const sizeSelect = this.rootPagination.querySelector('#paginacao-size');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.state.pagination.page = Math.max(1, this.state.pagination.page - 1);
                this.refresh();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.state.pagination.page = Math.min(totalPages, this.state.pagination.page + 1);
                this.refresh();
            });
        }

        if (sizeSelect) {
            sizeSelect.addEventListener('change', () => {
                const newSize = Number(sizeSelect.value) || 12;
                this.state.pagination.pageSize = newSize;
                this.state.pagination.page = 1;
                this.refresh();
            });
        }
    }

    refresh() {
        const filtered = this.applyFilters();

        const indicators = this.calculateIndicators(filtered);
        this.renderIndicators(indicators);

        this.renderRanking(this.rootTipos, this.groupSum(filtered, 'tipo', 'casos'), 'Casos registrados');
        this.renderRanking(this.rootEstados, this.groupSum(filtered, 'uf', 'casos'), 'Casos por estado');
        this.renderRanking(this.rootCidades, this.groupSum(filtered, 'cidade', 'denuncias'), 'Denúncias por cidade');

        const sorted = this.sortRows(filtered);
        const pageMeta = this.paginateRows(sorted);

        this.renderTable(pageMeta.rows, pageMeta.totalItems);
        this.renderPagination(pageMeta);
        this.renderTableHead();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PainelEstatisticas();
});
