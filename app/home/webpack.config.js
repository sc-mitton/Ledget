const path = require('path')
const Dotenv = require('dotenv-webpack')
const fs = require('fs')

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src', 'index.js')
    },
    output: {
        path: path.join(__dirname, '/public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        https: {
            key: fs.readFileSync('./certs/localhost.key'),
            cert: fs.readFileSync('./certs/localhost.crt'),
            ca: fs.readFileSync('./certs/ledgetCA.pem')
        },
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        historyApiFallback: true,
        host: 'localhost',
        open: {
            app: {
                name: 'firefox',
            },
        },
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '.env'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'static/',
                        },
                    },
                ],
            }
        ]
    }
}
