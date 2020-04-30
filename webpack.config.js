const path = require('path');

module.exports = [
    {
        mode: "production",
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 8080,
        },
    },
    {
        entry: './src/index.ts',
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname,'dist'),
        },
    },
    {
        entry: './src/game_main.ts',
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'game_bundle.js',
            path: path.resolve(__dirname,'dist'),
        },
    },
    {
        entry: './styles/app.scss',
        mode: "production",
        output:{
            filename: 'style-bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'bundle.css',
                            },
                        },
                        { loader: 'extract-loader' },
                        { loader: 'css-loader'},
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                sassOptions: {
                                    includePaths: ['./node_modules']
                                },
                            },
                        },
                    ],
                },
            ],
        },
    },
];