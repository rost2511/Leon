const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports =  (env = {mode: 'development'})  => {
    const isProduction = env.mode === 'production';

    const plugins = [
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
    ];

    if(isProduction) {
        plugins.push(
            new OptimizeCssAssetsPlugin({}),
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin([{
                    from: '**/*',  ignore: [ '*js', '*scss' ]
                }],
                { context: "src" }
            )
        )

    }





	return {
        mode: env.mode,

        entry: {
            app: ['./src/scss/style.scss']
        },
        output: {
                path: __dirname + "/dist",
                filename: '[name].js',
        },
        module: { 
            rules: [
                {  
                    test: /\.js$/,  
                     exclude: /node_modules/,    
                     use: ['babel-loader']
                },
                {
                    test: /\.scss$/,
                    use: [ 
                        MiniCssExtractPlugin.loader,  
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: !isProduction,
                                url: false 
                            }
                        }, 
                        'sass-loader'
                    ]
                  }

            ]
        },
        plugins: plugins,
        devServer: {
            contentBase: path.join(__dirname, 'src'),
            compress: true,
            port: 9000
        }
    }
}
